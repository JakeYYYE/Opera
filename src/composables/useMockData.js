import { ref, watch } from 'vue'

const STORAGE_KEY = 'flydrop_mock_data'

// Initial Data
const initialData = {
  needs: [
    {
      id: 1,
      category: '医疗急救',
      title: '市中心医院-分院区紧急血液样本每日往返运输服务',
      desc: '需具备医疗冷链运输资质，每日往返4次，单程距离15km，要求全天候响应能力。需提供符合医疗标准的运输箱及实时温控数据监测。',
      location: '北京市 · 朝阳区',
      budget: '¥50,000 / 月',
      date: '10分钟前',
      views: 128,
      urgent: true,
      publishTime: '2026-01-12 09:20',
      deadline: '2026-01-20',
      status: '进行中',
      requester: '市中心医院',
      attachments: [
        { name: '运输路线与时段说明.pdf', size: '1.2MB' },
        { name: '温控数据标准.xlsx', size: '320KB' }
      ],
      requirements: [
        '具备医疗冷链运输相关资质与案例，支持全链路温控记录与追溯',
        '每日往返4次，单程约15km，可提供应急增派能力与备用机保障',
        '运输箱具备恒温/保温能力，支持实时温度记录与异常告警',
        '需配合医院取样流程，做到交接签收、时间戳记录与异常处置'
      ],
      deliverables: [
        { name: '日运输记录', desc: '每趟签收、温控曲线、异常记录', format: 'PDF/Excel' },
        { name: '月度服务报告', desc: '准点率、异常处置、优化建议', format: 'PDF' }
      ],
      owner: { org: '市中心医院', name: '张主任', phone: '138****1024' }
    },
    {
      id: 2,
      category: '巡检监测',
      title: '2026年度西山森林防火期无人机常态化巡查项目',
      desc: '覆盖林区面积约3000亩，要求具备红外热成像功能，能识别早期火点并自动报警。需提供每日巡检报告及异常情况实时图传。',
      location: '北京市 · 海淀区',
      budget: '¥280,000',
      date: '2小时前',
      views: 456,
      urgent: false,
      publishTime: '2026-01-11 14:05',
      deadline: '2026-01-25',
      status: '进行中',
      requester: '西山林场管理处',
      attachments: [{ name: '巡检范围示意图.kml', size: '860KB' }],
      requirements: [
        '覆盖巡检范围约3000亩，制定巡检航线与应急航线两套方案',
        '具备红外热成像能力，可识别早期火点并自动告警',
        '支持异常情况实时图传，提供当日巡检报告与问题闭环记录'
      ],
      deliverables: [
        { name: '每日巡检报告', desc: '航线、覆盖率、异常点位与截图', format: 'PDF' },
        { name: '告警处置记录', desc: '告警信息、处置过程、结果归档', format: 'PDF/Excel' }
      ],
      owner: { org: '西山林场管理处', name: '李科长', phone: '139****6630' }
    },
    {
      id: 3,
      category: '地理测绘',
      title: '通州副中心某新建园区高精度倾斜摄影建模',
      desc: '测区面积2平方公里，要求地面分辨率优于3cm，输出OSGB及3DTiles格式模型。工期要求：外业采集3天，内业处理7天。',
      location: '北京市 · 通州区',
      budget: '¥45,000',
      date: '5小时前',
      views: 89,
      urgent: false,
      publishTime: '2026-01-11 09:30',
      deadline: '2026-01-22',
      status: '进行中',
      requester: '通州副中心管委会',
      attachments: [{ name: '测区边界.shp', size: '2.4MB' }],
      requirements: [
        '测区面积约2平方公里，GSD优于3cm，满足倾斜摄影采集规范',
        '输出OSGB与3DTiles模型，提供浏览与质检说明',
        '工期：外业3天，内业7天，提交阶段成果与验收材料'
      ],
      deliverables: [
        { name: 'OSGB实景模型', desc: '含纹理、坐标信息与浏览说明', format: 'OSGB' },
        { name: '3DTiles模型', desc: '支持Cesium加载的tileset', format: '3DTiles' }
      ],
      owner: { org: '通州副中心管委会', name: '王工', phone: '136****9081' }
    },
    {
      id: 4,
      category: '农林植保',
      title: '大兴区西瓜种植基地春季病虫害防治飞防服务',
      desc: '作业面积5000亩，主要防治蚜虫、红蜘蛛。要求使用T40或同级别以上机型，需自带药剂配比方案。',
      location: '北京市 · 大兴区',
      budget: '¥15 / 亩',
      date: '昨天',
      views: 210,
      urgent: false,
      publishTime: '2026-01-10 16:45',
      deadline: '2026-01-18',
      status: '进行中',
      requester: '大兴区农业合作社',
      attachments: [],
      requirements: [
        '作业面积5000亩，按地块分批次完成，需提供作业计划与人员机组安排',
        '机型要求T40或同级别以上，具备精准喷洒与断点续喷能力',
        '提供药剂配比方案与安全用药说明，作业后提交作业轨迹与面积统计'
      ],
      deliverables: [
        { name: '作业轨迹与面积统计', desc: '含地块、面积、时间与轨迹文件', format: 'PDF/Excel' },
        { name: '作业照片/视频', desc: '关键地块作业留痕与效果证明', format: 'JPG/MP4' }
      ],
      owner: { org: '大兴区农业合作社', name: '赵队长', phone: '137****5512' }
    },
    {
      id: 5,
      category: '文旅体验',
      title: '慕田峪长城春季宣传片航拍素材采集',
      desc: '需要专业的FPV飞手及航拍团队，拍摄日出、云海及长城春色。要求4K 60fps以上画质，需配合地面导演组进行多机位协同。',
      location: '北京市 · 怀柔区',
      budget: '¥12,000 / 天',
      date: '2天前',
      views: 340,
      urgent: false,
      publishTime: '2026-01-09 11:10',
      deadline: '2026-01-16',
      status: '进行中',
      requester: '慕田峪景区运营中心',
      attachments: [{ name: '分镜脚本与景别清单.docx', size: '540KB' }],
      requirements: [
        'FPV飞手与航拍团队具备商业拍摄经验，提供作品集与设备清单',
        '画质要求4K 60fps以上，具备ND镜与夜景拍摄辅助能力',
        '配合地面导演组进行多机位协同，按分镜完成素材交付'
      ],
      deliverables: [
        { name: '原始素材', desc: '按分镜编号整理交付', format: 'MOV/MP4' },
        { name: '航拍数据清单', desc: '含拍摄时间、机位、参数与备注', format: 'Excel' }
      ],
      owner: { org: '慕田峪景区运营中心', name: '刘导演', phone: '135****2209' }
    }
  ],
  tasks: [
    { id: 1, title: '郊区电力线路巡检', requester: '国网XX供电公司', price: '¥15,000', status: '已通过', deadline: '2026-01-20' },
    { id: 2, title: '房地产项目全景拍摄', requester: 'XX地产开发部', price: '¥5,000', status: '已完成', deadline: '2026-01-10' },
    { id: 3, title: '河道水质监测采样', requester: 'XX环保局', price: '¥8,500', status: '沟通中', deadline: '2026-01-25' },
  ],
  messages: [
    {
      id: 4,
      sender: '中科星图空间技术有限公司',
      requesterName: '西山林场',
      providerName: '中科星图空间技术有限公司',
      title: '关于“西山森林防火巡查”的沟通',
      needId: 2,
      content: '您好，关于森林巡查任务的红外热成像要求，请问具体的像素分辨率有硬性指标吗？我们目前备有M300RTK + H20T设备，不知是否符合您的需求。',
      time: '10分钟前',
      type: 'chat',
      history: [
        { role: 'them', text: '您好，关于森林巡查任务的红外热成像要求，请问具体的像素分辨率有硬性指标吗？我们目前备有M300RTK + H20T设备，不知是否符合您的需求。', time: '10:30' },
        { role: 'me', text: '稍等，我看下参数要求。', time: '10:32' },
        { role: 'them', text: '好的，期待您的回复。', time: '10:33' }
      ]
    },
    {
      id: 5,
      sender: '北京建工集团-李经理',
      requesterName: '北京建工集团-李经理',
      providerName: '中科星图空间技术有限公司',
      title: '关于“建筑工地测绘”服务的咨询',
      content: '张总，测绘成果已经收到了，精度符合要求。请问发票什么时候可以安排？',
      time: '1小时前',
      type: 'chat',
      history: [
        { role: 'me', text: '李经理，测绘数据已经上传到平台了，您可以下载查看一下。', time: '09:15' },
        { role: 'them', text: '收到，我让技术部核对一下。', time: '09:20' },
        { role: 'them', text: '张总，测绘成果已经收到了，精度符合要求。请问发票什么时候可以安排？', time: '10:45' }
      ]
    },
    {
      id: 6,
      sender: '大疆行业应用服务中心',
      requesterName: '中科星图空间技术有限公司',
      providerName: '大疆行业应用服务中心',
      title: '“同城急送”项目投标沟通',
      content: '我们已提交“同城急送”项目的报价方案，团队具备5年飞行经验，期待您的回复。',
      time: '2小时前',
      type: 'chat',
      history: [
        { role: 'them', text: '您好，我们对这个同城急送项目很感兴趣。', time: '08:50' },
        { role: 'them', text: '我们已提交“同城急送”项目的报价方案，团队具备5年飞行经验，期待您的回复。', time: '08:55' }
      ]
    },
    {
      id: 1,
      sender: '系统通知',
      title: '欢迎注册低空场景智慧飞滴平台',
      content: '尊敬的用户，欢迎您加入低空场景智慧飞滴平台！在这里您可以发布低空服务需求，或者成为服务商接单。请尽快完善您的个人资料以获得更好的体验。',
      time: '2026-01-13 10:00',
      type: 'system',
      history: []
    }
  ],
  myPilots: [
    { id: 1, name: '张志强', cert: 'AOPA机长证', hours: '1200小时', tags: ['电力巡检', '测绘'] },
    { id: 2, name: '王飞', cert: 'UTC二级', hours: '800小时', tags: ['航拍', '安防'] },
    { id: 3, name: '李云', cert: 'CAAC执照', hours: '2500小时', tags: ['植保', '教员'] }
  ],
  myDrones: [
    { id: 1, model: 'DJI M300 RTK', type: '多旋翼', payload: 'H20T', status: '空闲' },
    { id: 2, model: 'DJI Mavic 3E', type: '多旋翼', payload: '广角/长焦', status: '空闲' },
    { id: 3, model: 'JOUAV CW-15', type: '固定翼', payload: '正射相机', status: '维护中' }
  ],
  providers: [
    {
      id: 1,
      name: '中科星图空间技术有限公司',
      logo: 'https://cdn-icons-png.flaticon.com/512/2942/2942544.png',
      rating: 4.9,
      deals: 1208,
      tags: ['物流配送', '航线规划', '低空指挥'],
      desc: '国内领先的数字地球产品研发与产业化先行者，提供全方位的低空综合服务解决方案。',
      location: '北京 · 朝阳',
      verified: true,
      services: [
        { name: '低空物流配送方案', price: '¥5000起', desc: '全天候无人机物流配送，支持医疗急救、外卖快送。' },
        { name: '智慧城市巡检', price: '¥8000/天', desc: '城市违建、交通流量、环保监测综合巡检服务。' }
      ],
      cases: [
        { title: '某市智慧城市低空巡检', image: 'https://picsum.photos/seed/provider_case_1/800/480' },
        { title: '山区应急救援物资投送', image: 'https://picsum.photos/seed/provider_case_2/800/480' }
      ]
    },
    {
      id: 2,
      name: '大疆行业应用服务中心',
      logo: 'https://cdn-icons-png.flaticon.com/512/5969/5969040.png',
      rating: 5.0,
      deals: 5600,
      tags: ['设备租赁', '飞行培训', '定制开发'],
      desc: '大疆创新官方授权行业应用服务商，专注为企事业单位提供无人机解决方案。',
      location: '广东 · 深圳',
      verified: true,
      services: [],
      cases: []
    },
    {
      id: 3,
      name: '极飞农业科技服务部',
      logo: 'https://cdn-icons-png.flaticon.com/512/3022/3022646.png',
      rating: 4.8,
      deals: 3400,
      tags: ['农林植保', '智慧农业', '播种施肥'],
      desc: '致力于推动全球农业智能化，提供精准高效的农业无人机植保服务。',
      location: '广东 · 广州',
      verified: true,
      services: [],
      cases: []
    },
    {
      id: 4,
      name: '顺丰同城急送无人机大队',
      logo: 'https://cdn-icons-png.flaticon.com/512/726/726455.png',
      rating: 4.9,
      deals: 8900,
      tags: ['即时配送', '同城急送', '医疗冷链'],
      desc: '构建城市低空物流网络，提供15分钟达的极致配送体验，覆盖医疗、餐饮等场景。',
      location: '上海 · 浦东',
      verified: true,
      services: [],
      cases: []
    },
    {
      id: 5,
      name: '纵横股份测绘服务',
      logo: 'https://cdn-icons-png.flaticon.com/512/2675/2675904.png',
      rating: 4.7,
      deals: 450,
      tags: ['地理测绘', '实景三维', '工程测量'],
      desc: '工业无人机领军企业，提供高精度航空测绘与数据处理服务。',
      location: '四川 · 成都',
      verified: true,
      services: [],
      cases: []
    },
    {
      id: 6,
      name: '美团无人机配送',
      logo: 'https://cdn-icons-png.flaticon.com/512/888/888879.png',
      rating: 4.8,
      deals: 12000,
      tags: ['外卖配送', '社区服务', '最后一公里'],
      desc: '美团自研无人机配送网络，让万物到家更快速、更便捷。',
      location: '广东 · 深圳',
      verified: true,
      services: [],
      cases: []
    },
    {
      id: 7,
      name: '卓翼智能应急救援队',
      logo: 'https://cdn-icons-png.flaticon.com/512/921/921513.png',
      rating: 5.0,
      deals: 120,
      tags: ['应急救援', '消防灭火', '物资投送'],
      desc: '专业系留无人机及工业级无人机系统提供商，专注应急与特种行业应用。',
      location: '北京 · 海淀',
      verified: true,
      services: [],
      cases: []
    },
    {
      id: 8,
      name: '亿航智能载人飞行',
      logo: 'https://cdn-icons-png.flaticon.com/512/2317/2317963.png',
      rating: 4.9,
      deals: 56,
      tags: ['空中游览', '载人交通', '低空旅游'],
      desc: '全球领先的智能自动驾驶飞行器科技企业，开启城市空中交通新纪元。',
      location: '广东 · 广州',
      verified: true,
      services: [],
      cases: []
    }
  ],
  news: [
    {
      id: 1,
      title: '民航局发布《民用无人驾驶航空器运行安全管理规则》',
      summary: '为规范民用无人驾驶航空器运行安全管理，促进无人驾驶航空器产业健康有序发展，民航局制定本规则。',
      category: '政策解读',
      image: 'https://picsum.photos/seed/news1/800/450',
      author: '中国民航局',
      publishTime: '2026-01-10',
      views: 12506,
      content: '<p>近日，民航局发布《民用无人驾驶航空器运行安全管理规则》（以下简称《规则》）。《规则》依据《无人驾驶航空器飞行管理暂行条例》制定，旨在规范民用无人驾驶航空器运行安全管理，促进无人驾驶航空器产业健康有序发展。</p><p>《规则》共8章、103条，主要包括总则、管理机构与职责、航空器管理、人员资质、运行管理、空域保持与飞行服务、监督管理及附则等内容。</p><p>这一新规的发布标志着我国低空经济法律法规体系进一步完善，为行业的合规化、规模化发展奠定了坚实基础。</p>'
    },
    {
      id: 2,
      title: '低空经济迎万亿蓝海，多地出台支持政策',
      summary: '随着低空空域管理改革的深入，低空经济正在成为新的经济增长点，各地纷纷出台政策抢占先机。',
      category: '行业资讯',
      image: 'https://picsum.photos/seed/news2/800/450',
      author: '经济日报',
      publishTime: '2026-01-12',
      views: 8902,
      content: '<p>低空经济是以低空空域为依托，以各种有人驾驶和无人驾驶航空器的低空飞行活动为牵引，辐射带动相关领域融合发展的综合性经济形态。</p><p>目前，深圳、上海、合肥等地已相继发布低空经济高质量发展行动计划，从产业集聚、场景应用、基础设施等方面给予全方位支持。</p><p>专家预测，到2030年，我国低空经济规模有望突破2万亿元，成为推动经济高质量发展的新引擎。</p>'
    },
    {
      id: 3,
      title: '某市智慧城市低空巡检项目顺利验收',
      summary: '由中科星图承建的某市智慧城市低空巡检项目近日顺利通过验收，实现了城市管理的立体化、智能化。',
      category: '应用案例',
      image: 'https://picsum.photos/seed/news3/800/450',
      author: '中科星图',
      publishTime: '2026-01-08',
      views: 5600,
      content: '<p>该项目部署了30余套无人机自动机场，覆盖全市主要城区。通过AI算法识别，可自动发现违章建筑、交通拥堵、垃圾堆放等城市治理问题，大大提高了巡查效率。</p><p>项目负责人表示：“传统的人工巡查耗时费力，且存在盲区。引入无人机巡检后，我们实现了全天候、无死角的城市管理，问题发现率提升了300%。”</p><p>未来，该市将继续深化低空技术在环保监测、应急救援等领域的应用。</p>'
    },
    {
      id: 4,
      title: '大疆发布新一代行业级无人机，续航突破50分钟',
      summary: '大疆创新今日发布新一代行业级无人机M350 RTK，在图传距离、防护等级、电池寿命等方面均有显著提升。',
      category: '技术前沿',
      image: 'https://picsum.photos/seed/news4/800/450',
      author: '无人机世界',
      publishTime: '2026-01-05',
      views: 15300,
      content: '<p>M350 RTK拥有55分钟超长续航，支持O3图传行业版，最大图传距离可达20公里。同时具备IP55防护等级，可在雨雪天气下作业。</p><p>新机型还配备了更强大的夜视功能和智能避障系统，能够适应更加复杂的作业环境。</p><p>业内人士认为，M350 RTK的发布将进一步巩固大疆在行业级无人机市场的领先地位。</p>'
    },
    {
      id: 5,
      title: '关于开展2026年度民用无人驾驶航空器实名登记的通知',
      summary: '为进一步加强民用无人驾驶航空器管理，保障航空安全，现就2026年度实名登记有关事项通知如下。',
      category: '政策解读',
      image: 'https://picsum.photos/seed/news5/800/450',
      author: '民航局',
      publishTime: '2026-01-01',
      views: 21000,
      content: '<p>所有最大起飞重量超过250克的民用无人驾驶航空器，所有人均需在民用无人驾驶航空器实名登记信息系统进行实名登记，并在机身显著位置粘贴登记二维码。</p><p>未按规定进行实名登记的，将依据《无人驾驶航空器飞行管理暂行条例》进行处罚。</p><p>请广大飞友自觉遵守相关规定，共同维护良好的飞行秩序。</p>'
    },
    {
      id: 6,
      title: '美团无人机深圳配送订单突破10万单',
      summary: '美团无人机在深圳的配送网络持续加密，累计完成真实订单超过10万单，平均配送时间压缩至15分钟。',
      category: '行业资讯',
      image: 'https://picsum.photos/seed/news6/800/450',
      author: '科技日报',
      publishTime: '2026-01-13',
      views: 11200,
      content: '<p>截至2026年1月，美团无人机在深圳已开通20余条常态化航线，覆盖社区、商圈、景区等多种场景。累计完成真实订单超过10万单，为用户提供了“万物到家”的极速体验。</p><h3>15分钟必达</h3><p>通过优化航线规划与调度算法，美团无人机将平均配送时间压缩至15分钟以内，相比传统骑手配送效率提升了50%以上。</p><p>未来，美团计划将无人机配送服务推广至更多一线城市。</p>'
    },
    {
      id: 7,
      title: '全球首款吨级eVTOL成功完成载人首飞',
      summary: '由国内初创企业自主研发的吨级电动垂直起降航空器（eVTOL）今日成功完成载人首飞，标志着城市空中交通（UAM）迈出关键一步。',
      category: '技术前沿',
      image: 'https://picsum.photos/seed/news7/800/450',
      author: '航空知识',
      publishTime: '2026-01-11',
      views: 18900,
      content: '<p>今日上午，由国内初创企业自主研发的吨级电动垂直起降航空器（eVTOL）在华东某试验基地成功完成载人首飞。飞行持续约10分钟，飞行高度100米，各项指标均达到设计要求。</p><ul><li>最大起飞重量：2000kg</li><li>巡航速度：200km/h</li><li>最大航程：150km</li></ul><p>该机型采用复合翼构型，兼具垂直起降与高速巡航能力，未来有望应用于城市空中出行、应急救援等领域。</p>'
    },
    {
      id: 8,
      title: '电力巡检降本增效：无人机替代率超80%',
      summary: '国家电网某省公司发布数据，2025年无人机巡检替代率已超80%，累计发现缺陷5万余处，巡检成本降低40%。',
      category: '应用案例',
      image: 'https://picsum.photos/seed/news8/800/450',
      author: '中国电力报',
      publishTime: '2026-01-09',
      views: 7800,
      content: '<p>国家电网某省公司发布数据，2025年该省输电线路无人机巡检替代率已超80%。相比传统人工爬塔巡检，无人机巡检效率提升了5倍以上，巡检成本降低了40%。</p><p>通过搭载激光雷达、红外热成像等载荷，无人机可精细化识别绝缘子破损、导线发热等隐患，累计发现缺陷5万余处，有效保障了电网安全稳定运行。</p>'
    },
    {
      id: 9,
      title: '农业农村部：加快推进“无人农场”建设',
      summary: '农业农村部印发指导意见，提出到2028年建设100个国家级“无人农场”，推动农业生产智能化、无人化。',
      category: '政策解读',
      image: 'https://picsum.photos/seed/news9/800/450',
      author: '农民日报',
      publishTime: '2026-01-07',
      views: 9500,
      content: '<p>农业农村部近日印发《关于加快推进“无人农场”建设的指导意见》，提出到2028年建设100个国家级“无人农场”。</p><p>《意见》明确，要重点突破农业机器人、农业物联网、农业大数据等关键技术，实现耕、种、管、收全环节无人化作业。</p><p>无人机作为“无人农场”的核心装备之一，将在精准植保、农情监测等方面发挥重要作用。</p>'
    },
    {
      id: 10,
      title: '顺丰同城急送开通“空中急救通道”',
      summary: '顺丰同城急送联合多家三甲医院，开通血液、急救药品无人机配送专线，为生命接力加速。',
      category: '应用案例',
      image: 'https://picsum.photos/seed/news10/800/450',
      author: '健康时报',
      publishTime: '2026-01-06',
      views: 13400,
      content: '<p>顺丰同城急送近日宣布，已联合北京、上海等多家三甲医院，开通血液、急救药品无人机配送专线。</p><p>该专线采用物流无人机进行点对点运输，不受地面交通拥堵影响，配送时间平均缩短60%。在紧急情况下，这条“空中急救通道”将为抢救生命争取宝贵时间。</p><p>目前，该服务已成功执行运输任务500余架次，运输血液样本2000余份。</p>'
    },
    {
      id: 11,
      title: '新型固态电池问世，无人机续航有望翻倍',
      summary: '某高校科研团队研发出新型高能量密度固态电池，实测能量密度达500Wh/kg，有望解决无人机续航痛点。',
      category: '技术前沿',
      image: 'https://picsum.photos/seed/news11/800/450',
      author: '科学网',
      publishTime: '2026-01-04',
      views: 22100,
      content: '<p>某高校科研团队在固态电池领域取得重大突破，研发出一种基于新型电解质的高能量密度固态电池。</p><p>实验室测试数据显示，该电池能量密度高达500Wh/kg，是现有商用锂离子电池的2倍以上。且具有安全性高、循环寿命长等优点。</p><p>若该技术成功实现产业化，消费级无人机的续航时间有望从目前的30分钟提升至1小时以上，行业级无人机甚至可达2小时以上，彻底解决续航焦虑。</p>'
    },
    {
      id: 12,
      title: '低空旅游成新宠，长城、黄山等地推出观光航线',
      summary: '随着低空空域的逐步开放，低空旅游市场持续升温。长城、黄山等知名景区纷纷推出直升机、热气球观光航线。',
      category: '行业资讯',
      image: 'https://picsum.photos/seed/news12/800/450',
      author: '中国旅游报',
      publishTime: '2026-01-02',
      views: 6700,
      content: '<p>“上帝视角”看美景，低空旅游正在成为游客的新宠。今年元旦假期，八达岭长城、黄山风景区等地的低空观光项目预订火爆。</p><p>游客只需花费几百元，即可乘坐直升机或热气球，从空中俯瞰壮丽山河，获得独一无二的视觉体验。</p><p>业内专家指出，低空旅游不仅丰富了旅游产品体系，也带动了通航运营、航空文化普及等相关产业发展。</p>'
    }
  ]
}

const state = ref(initialData)

// Initialize from storage if available
if (localStorage.getItem(STORAGE_KEY)) {
  try {
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY))
    // Migration: Ensure new fields exist
    if (!savedData.providers) {
      savedData.providers = initialData.providers
    }
    if (!savedData.myPilots) {
      savedData.myPilots = initialData.myPilots
    }
    if (!savedData.myDrones) {
      savedData.myDrones = initialData.myDrones
    }
    // Force update news to ensure image URLs are fixed
    savedData.news = initialData.news
    state.value = savedData
  } catch (e) {
    console.error('Failed to load mock data', e)
  }
}

// Watch for changes and save to storage
watch(state, (newVal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// Helper actions
const addTask = (task) => {
  state.value.tasks.unshift(task)
}

const updateNeedStatus = (id, status) => {
  const need = state.value.needs.find(n => n.id === id)
  if (need) {
    need.status = status
  }
}

const addMessage = (msg) => {
  state.value.messages.unshift(msg)
}

const addProposal = (need, proposal) => {
  // 1. Check if chat exists
  let chat = state.value.messages.find(m => m.needId === need.id)
  let isNewChat = false
  
  if (!chat) {
    isNewChat = true
    const newId = Date.now()
    const chatTitle = `关于“${need.title.length > 10 ? need.title.substring(0, 10) + '...' : need.title}”的方案`
    
    chat = {
      id: newId,
      sender: need.requester || need.owner?.org || '需求方',
      title: chatTitle,
      needId: need.id,
      content: `[方案] ${proposal.description ? proposal.description.substring(0, 20) : '新方案'}...`,
      type: 'chat',
      history: []
    }
    state.value.messages.unshift(chat)
  }

  // 2. Add proposal message to history
  const proposalMsg = {
    role: 'me',
    type: 'plan_proposal',
    ...proposal,
    status: 'pending',
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }
  chat.history.push(proposalMsg)
  
  // Update last message content
  chat.content = `[方案已提交] 报价：¥${proposal.price}`
  chat.time = '刚刚'

  // 3. Create or Update Task Status
  // Check if task exists for this need
  let existingTask = state.value.tasks.find(t => t.needId === need.id)
  
  if (!existingTask) {
    const newTask = {
      id: Date.now() + 1000,
      title: need.title,
      requester: need.requester || '需求方',
      price: `¥${proposal.price}`,
      status: '沟通中',
      deadline: proposal.duration || need.deadline || '待定',
      needId: need.id
    }
    addTask(newTask)
  } else {
    if (existingTask.status === '已取消' || existingTask.status === '已拒绝') {
        existingTask.status = '沟通中'
        existingTask.price = `¥${proposal.price}`
    }
  }

  return chat.id
}

const addPlan = (msgId, plan) => {
  const msg = state.value.messages.find(m => m.id === msgId)
  if (msg) {
    if (!msg.history) msg.history = []
    msg.history.push({
      role: 'me',
      type: 'plan_proposal',
      ...plan,
      status: 'pending',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    })
  }
}

const acceptPlan = (msgId, planIndex) => {
  const msg = state.value.messages.find(m => m.id === msgId)
  if (msg && msg.history[planIndex]) {
    // Update plan status
    msg.history[planIndex].status = 'accepted'
    
    // Find task and update status
    const task = state.value.tasks.find(t => t.id === msg.taskId)
    if (task) {
      task.status = '已通过'
      task.price = msg.history[planIndex].price
    } else {
        // Fallback if task lost or not linked (should not happen in new flow)
        addTask({
            id: Date.now(),
            title: msg.title.replace('关于“', '').replace('”的沟通', '') || '新任务',
            requester: msg.sender,
            price: msg.history[planIndex].price,
            status: '已通过',
            deadline: '2026-02-01' 
        })
    }
    
    // Update need status if linked
    if (msg.needId) {
      updateNeedStatus(msg.needId, '执行中')
    }
    
    // Add system message
    msg.history.push({
      role: 'system',
      text: `方案已接受，任务状态已更新为“已通过”。`,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    })
  }
}

export const useMockData = () => {
  return {
    state,
    addTask,
    updateNeedStatus,
    addMessage,
    addPlan,
    acceptPlan,
    addProposal
  }
}
