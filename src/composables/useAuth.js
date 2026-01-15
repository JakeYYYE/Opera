import { ref, computed } from 'vue'
import { cUsers, bUsers } from '../data/mockUsers'

const currentUser = ref(null)
const activeIdentityState = ref(localStorage.getItem('activeIdentity') || 'provider')

function syncIdentityFromUser(user) {
  if (!user) {
    localStorage.removeItem('activeIdentity')
    localStorage.removeItem('providerLevel')
    activeIdentityState.value = 'provider'
    return
  }
  let identity = 'provider'
  if (user.requesterEnterprise) {
    identity = 'requester_enterprise'
  } else if (user.requesterPersonal) {
    identity = 'requester_personal'
  }
  // Keep existing activeIdentity if valid for this user
  const current = localStorage.getItem('activeIdentity')
  if (current) {
      if (current === 'provider' && user.providerLevel) identity = 'provider'
      else if (current === 'requester_enterprise' && user.requesterEnterprise) identity = 'requester_enterprise'
      else if (current === 'requester_personal' && user.requesterPersonal) identity = 'requester_personal'
  }

  localStorage.setItem('activeIdentity', identity)
  activeIdentityState.value = identity
  const level = user.providerLevel || 'lv1'
  localStorage.setItem('providerLevel', level)
}

try {
  const storedUser = localStorage.getItem('currentUser')
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser)
    // Don't overwrite activeIdentity from storage if it exists
    const storedIdentity = localStorage.getItem('activeIdentity')
    if (storedIdentity) {
        activeIdentityState.value = storedIdentity
    } else {
        syncIdentityFromUser(currentUser.value)
    }
  }
} catch (e) {
  console.error('Failed to load user from localStorage', e)
}

export function useAuth() {
  const login = async (username, password, targetIdentity = 'requester') => {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (username === 'admin' && password === 'admin') {
        const adminUser = {
            id: 0,
            nickname: '系统管理员',
            username: 'admin',
            role: 'admin',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        }
        currentUser.value = adminUser
        localStorage.setItem('currentUser', JSON.stringify(adminUser))
        localStorage.setItem('activeIdentity', 'provider')
        activeIdentityState.value = 'provider'
        localStorage.setItem('providerLevel', 'lv4')
        return { success: true, user: adminUser }
    }

    const cUser = cUsers.find(u => 
      (u.username === username || u.phone === username) && 
      u.password === password
    )
    if (cUser) {
        // Validate targetIdentity capability
        if (targetIdentity === 'provider' && !cUser.providerLevel) {
            return { success: false, message: '该账号未开通服务商身份，请以需求方身份登录' }
        }

        const user = { 
          ...cUser, 
          role: 'c-user'
        }
        currentUser.value = user
        localStorage.setItem('currentUser', JSON.stringify(user))
        
        // Set identity
        const identity = targetIdentity === 'provider' ? 'provider' : (user.requesterEnterprise ? 'requester_enterprise' : 'requester_personal')
        localStorage.setItem('activeIdentity', identity)
        activeIdentityState.value = identity
        
        return { success: true, user }
    }

    const bUser = bUsers.find(u => 
      (u.username === username || u.phone === username) && 
      u.password === password
    )
    if (bUser) {
        const user = { 
          ...bUser, 
          role: 'b-user', 
          nickname: bUser.companyName
        }
        currentUser.value = user
        localStorage.setItem('currentUser', JSON.stringify(user))
        
        // Set identity
        // B-Users are always providers, but if they want to act as requester?
        // Current logic: B-User is primarily Provider. If they want to be Requester, they must have requesterEnterprise/Personal set.
        let identity = 'provider'
        if (targetIdentity === 'requester') {
             if (user.requesterEnterprise) identity = 'requester_enterprise'
             else if (user.requesterPersonal) identity = 'requester_personal'
             else {
                 // Auto-enable requester capability for B-users if missing? Or just default to provider?
                 // Let's assume B-users can always be requesters (as Enterprise Requester)
                 identity = 'requester_enterprise'
                 user.requesterEnterprise = true // Implicitly grant
             }
        }
        
        localStorage.setItem('activeIdentity', identity)
        activeIdentityState.value = identity

        return { success: true, user }
    }

    return { success: false, message: '用户名或密码错误' }
  }

  const register = async (userInfo) => {
      await new Promise(resolve => setTimeout(resolve, 800))
      if (!userInfo.username || !userInfo.password) {
        return { success: false, message: '请填写完整信息' }
      }

      // registerRole is now 'personal' or 'enterprise'
      const isEnterprise = userInfo.registerRole === 'enterprise'
      const role = isEnterprise ? 'b-user' : 'c-user'
      
      // Determine primary intent
      const isProviderIntent = userInfo.registerIdentity === 'provider'

      const exists = cUsers.some(u => u.username === userInfo.username) || bUsers.some(u => u.username === userInfo.username)
      if (exists) {
        return { success: false, message: '用户名已存在' }
      }

      const newUser = {
          id: Date.now(),
          nickname: userInfo.nickname || `用户${Math.floor(Math.random() * 1000)}`,
          username: userInfo.username,
          password: userInfo.password,
          phone: userInfo.phone || '',
          role: role,
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          registerDate: new Date().toISOString().split('T')[0],
          status: 'active',
          
          // C-User Defaults
          level: 'novice',
          certificationStatus: 'none',
          requesterPersonal: !isEnterprise, // C-users always get personal requester capability
          
          // B-User Defaults
          // If enterprise, default to lv3 provider unless they explicitly only want to be requester (but usually B-users are providers)
          // If C-user registers as provider, give them lv1
          providerLevel: isEnterprise ? 'lv3' : (isProviderIntent ? 'lv1' : ''),
          requesterEnterprise: isEnterprise,
          
          pilotLicense: false,
          insuranceActive: false,
          idVerified: false
      }
      
      if (role === 'c-user') {
          cUsers.push(newUser)
      } else {
          // B-User specific fields
          newUser.companyName = newUser.nickname
          newUser.type = 'general'
          bUsers.push(newUser)
      }

      currentUser.value = newUser
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      
      // Set active identity based on selection
      let identity = 'provider'
      if (isProviderIntent) {
          identity = 'provider'
      } else {
          identity = isEnterprise ? 'requester_enterprise' : 'requester_personal'
      }
      
      localStorage.setItem('activeIdentity', identity)
      activeIdentityState.value = identity
      
      return { success: true, user: newUser }
  }

  const applyToProvider = (info) => {
    if (!currentUser.value) {
      return { success: false, message: '请先登录' }
    }
    const updated = { ...currentUser.value }
    if (info.realName) {
      updated.realName = info.realName
    }
    if (info.flightHours !== undefined && info.flightHours !== null && info.flightHours !== '') {
      const num = Number(info.flightHours)
      updated.flightHours = Number.isNaN(num) ? 0 : num
    }
    if (info.pilotLicense !== undefined) {
      updated.pilotLicense = !!info.pilotLicense
    }
    if (info.insuranceActive !== undefined) {
      updated.insuranceActive = !!info.insuranceActive
    }
    if (info.pilotLicenseDocs) {
      updated.pilotLicenseDocs = Array.isArray(info.pilotLicenseDocs) ? info.pilotLicenseDocs : []
    }
    if (info.insuranceDocs) {
      updated.insuranceDocs = Array.isArray(info.insuranceDocs) ? info.insuranceDocs : []
    }
    if (!updated.providerLevel) {
      updated.providerLevel = 'lv1'
    }
    updated.certificationStatus = updated.certificationStatus && updated.certificationStatus !== 'none' ? updated.certificationStatus : 'pending'
    currentUser.value = updated
    localStorage.setItem('currentUser', JSON.stringify(updated))
    if (updated.role === 'c-user') {
      const index = cUsers.findIndex(u => u.username === updated.username)
      if (index > -1) {
        cUsers[index] = { ...cUsers[index], ...updated }
      }
    } else if (updated.role === 'b-user') {
      const index = bUsers.findIndex(u => u.username === updated.username)
      if (index > -1) {
        bUsers[index] = { ...bUsers[index], ...updated }
      }
    }
    syncIdentityFromUser(updated)
    return { success: true, user: updated }
  }

  const updateProfile = (info) => {
    if (!currentUser.value) {
      return { success: false, message: '请先登录' }
    }
    const updated = { ...currentUser.value, ...info }
    currentUser.value = updated
    localStorage.setItem('currentUser', JSON.stringify(updated))
    if (updated.role === 'c-user') {
      const index = cUsers.findIndex(u => u.username === updated.username)
      if (index > -1) {
        cUsers[index] = { ...cUsers[index], ...updated }
      }
    } else if (updated.role === 'b-user') {
      const index = bUsers.findIndex(u => u.username === updated.username)
      if (index > -1) {
        bUsers[index] = { ...bUsers[index], ...updated }
      }
    }
    syncIdentityFromUser(updated)
    return { success: true, user: updated }
  }

  const applyToBProvider = (info) => {
    if (!currentUser.value) {
      return { success: false, message: '请先登录' }
    }
    const updated = { ...currentUser.value }
    updated.upgradeToB = {
      ...(updated.upgradeToB || {}),
      status: 'pending',
      companyName: info.companyName || '',
      type: info.type || '',
      contactName: info.contactName || '',
      contactPhone: info.contactPhone || '',
      remark: info.remark || '',
      pilotLicenseDocs: Array.isArray(info.pilotLicenseDocs) ? info.pilotLicenseDocs : [],
      insuranceDocs: Array.isArray(info.insuranceDocs) ? info.insuranceDocs : []
    }
    currentUser.value = updated
    localStorage.setItem('currentUser', JSON.stringify(updated))
    if (updated.role === 'c-user') {
      const index = cUsers.findIndex(u => u.username === updated.username)
      if (index > -1) {
        cUsers[index] = { ...cUsers[index], ...updated }
      }
    } else if (updated.role === 'b-user') {
      const index = bUsers.findIndex(u => u.username === updated.username)
      if (index > -1) {
        bUsers[index] = { ...bUsers[index], ...updated }
      }
    }
    return { success: true, user: updated }
  }

  const applyToRequester = (info) => {
    if (!currentUser.value) {
      return { success: false, message: '请先登录' }
    }
    const updated = { ...currentUser.value }
    const type = info.requesterType || 'personal'
    if (type === 'enterprise') {
      updated.requesterEnterprise = true
      updated.requesterPersonal = !!updated.requesterPersonal
      if (info.orgName) {
        updated.requesterOrg = info.orgName
      }
    } else {
      updated.requesterPersonal = true
      if (updated.requesterEnterprise && !info.keepEnterprise) {
        updated.requesterEnterprise = false
      }
    }
    if (info.contactName) {
      updated.requesterContact = info.contactName
    }
    if (info.contactPhone) {
      updated.requesterPhone = info.contactPhone
    }
    currentUser.value = updated
    localStorage.setItem('currentUser', JSON.stringify(updated))
    if (updated.role === 'c-user') {
      const index = cUsers.findIndex(u => u.username === updated.username)
      if (index > -1) {
        cUsers[index] = { ...cUsers[index], ...updated }
      }
    } else if (updated.role === 'b-user') {
      const index = bUsers.findIndex(u => u.username === updated.username)
      if (index > -1) {
        bUsers[index] = { ...bUsers[index], ...updated }
      }
    }
    syncIdentityFromUser(updated)
    return { success: true, user: updated }
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('currentUser')
    localStorage.removeItem('activeIdentity')
    localStorage.removeItem('providerLevel')
    activeIdentityState.value = 'provider'
  }

  const switchIdentity = (identity) => {
    if (!currentUser.value) return { success: false, message: '请先登录' }

    const user = currentUser.value

    // 限制：B端账号只能在 B 端身份之间切换，C端账号只能在 C 端身份之间切换
    const isBUser = user.role === 'b-user'
    const isCUser = user.role === 'c-user'

    // 目标身份必须合法
    const allowedIdentities = []
    if (isBUser) {
      if (user.providerLevel) allowedIdentities.push('provider')
      if (user.requesterEnterprise) allowedIdentities.push('requester_enterprise')
      // 不允许 B 端切到 requester_personal
    } else if (isCUser) {
      if (user.providerLevel) allowedIdentities.push('provider')
      if (user.requesterPersonal) allowedIdentities.push('requester_personal')
      // 不允许 C 端切到 requester_enterprise
    } else {
      // 管理员或其他角色，直接允许
      allowedIdentities.push(identity)
    }

    if (!allowedIdentities.includes(identity)) {
      return { success: false, message: '当前账号不支持切换到该身份' }
    }

    localStorage.setItem('activeIdentity', identity)
    activeIdentityState.value = identity
    return { success: true, identity }
  }

  return {
    user: currentUser,
    isAuthenticated: computed(() => !!currentUser.value),
    isAdmin: computed(() => currentUser.value?.role === 'admin'),
    activeIdentity: computed(() => activeIdentityState.value),
    login,
    register,
    logout,
    updateProfile,
    applyToProvider,
    applyToRequester,
    applyToBProvider,
    switchIdentity
  }
}
