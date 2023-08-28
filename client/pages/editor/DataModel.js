import { createUUID, deepClone } from '../../../common/uitls';
import { cloneDeep, merge, sortBy } from 'lodash';
import $config from '@client/config';

// 元素配置信息字段
let elementConfig = {
  elName: '', // 组件名
  animations: [], // 动画
  commonStyle: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: 200,
    left: 0,
    rotate: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderWidth: 0,
    borderColor: '',
    borderStyle: 'solid',
    borderRadius: 0,
    boxShadow: '',
    fontSize: 16,
    fontFamily: 'SourceHanSansSC-Regular',
    fontType: {
      preview: {
        width: 401,
        url: 'https://st0.dancf.com/csc/157/fonts/229/20191126-111502-3192.svg',
        height: 80
      },
      user_over_role: 0,
      authorization_id: 12,
      price: 0,
      name: 'SourceHanSansSC-Regular',
      sale_type: 1,
      id: 206607,
      items: [],
      content: {
        ttf_size: 1931900,
        origin_file: {
          size: 3845576,
          url: 'https://st0.dancf.com/csc/213/fonts/229/20210601-182228-bbf2.ttf'
        },
        woff_size: 1258276,
        ttf: 'https://st0.dancf.com/csc/213/fonts/229/20210601-182228-bdaf.ttf',
        meta_data: {
          hHeadLineGap: 0,
          winDescent: 320,
          emSize: 1000,
          hHeadDescent: -320,
          underlinePosition: -125,
          typoLineGap: 0,
          winAscent: 1160,
          descent: -320,
          ascent: 1160,
          capitalHeight: 733,
          xHeight: 543,
          underlineThickness: 50,
          typoDescent: -120,
          typoAscent: 880,
          hHeadAscent: 1160
        },
        alias: '思源黑体 常规',
        weight: 400,
        style: 'normal',
        family: 'Source Han Sans SC Regular',
        lang: 'zh',
        woff: 'https://st0.dancf.com/csc/213/fonts/229/20210601-182228-08fb.woff'
      }
    },
    writingMode: '',
    fontStyle: '',
    fontWeight: 'normal',
    textDecoration: '',
    lineHeight: 1.4,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
    candidateColor: [], //新增随机颜色候选列表
    backgroundColor: 'rgba(255, 255, 255, 1)',
    backgroundImage: '',
    backgroundSize: 'cover',
    transform: '',
    opacity: 1,
    zIndex: 1,
    lock: false, //是否锁定
    elName: '', // 组件名
    WebkitMask: '', //是否有蒙版
    webkitMaskStyle: {
      left: 0,
      top: 0,
      rotate: 0,
      scale: 1
    }, //蒙版样式
    textShadow: '' //特效文字
  }, // 公共样式
  events: [], // 事件
  propsValue: {}, // 属性参数
  value: '', // 绑定值
  valueType: 'String', // 值类型
  ImageUrl: '' //图片路径
};

// 页面配置信息字段
let pageConfig = {
  name: '',
  elements: [],
  commonStyle: {
    // backgroundColor: "red",
    backgroundColor: 'rgba(255, 255, 255, 1)',
    backgroundImage: '',
    backgroundSize: 'cover',
    height: 800, //页面高度
    elName: ''
  },
  data: {
    time: 2,
    duration: 30,
    trans: 'Fat',
    transDuration: 1.5
  },
  config: {},
  elementNum: 0 //页面中有几个元素
};

// 项目配置信息字段
let projectConfig = {
  name: '',
  title: '视搭视频',
  description: '我用视搭可视化编辑器做了一个超酷炫的视频，快来看看吧。',
  coverImage: '',
  author: '',
  script: '',
  width: $config.canvasH5Width,
  height: $config.canvasH5Height,
  pages: []
};

let num = 1;
let getElementConfig = function (element, extendStyle = {}) {
  console.log(element, extendStyle, 6666);
  let elementData = cloneDeep(element);
  let type = elementData.valueType || 'String'; // 默认string类型
  let dict = {
    Sting: '',
    Array: [],
    Object: {},
    Boolean: false,
    Number: 0
    // 待扩展数据类型
  };

  let elementConfigData = cloneDeep(elementConfig);
  let config = {
    uuid: createUUID(),
    ...elementConfigData,
    elName: elementData.elName,
    propsValue: deepClone(elementData.needProps || {})
  };
  // 样式
  config.commonStyle = merge(config.commonStyle, elementData.defaultStyle);
  config.commonStyle = merge(config.commonStyle, extendStyle);
  config.value = element.defaultValue || dict[type];
  config.valueType = type;
  config.commonStyle.top =
    config.commonStyle.top + 10 * pageConfig.elementNum++;
  config.commonStyle.left =
    config.commonStyle.left + 10 * pageConfig.elementNum;
  return config;
};

let copyElement = function (element, extendStyle = {}, copyType = 'element') {
  element = cloneDeep(element);
  element.uuid = createUUID();
  element.commonStyle = merge(element.commonStyle, extendStyle);
  element.animations.forEach((item) => {
    item.uuid = createUUID();
  });
  console.log(extendStyle);
  if (copyType === 'element') {
    // 加上一点偏移量，以作区分
    element.commonStyle.top = element.commonStyle.top + 10;
    element.commonStyle.left = element.commonStyle.left + 10;
  }

  return element;
};

let getPageConfig = function () {
  return {
    uuid: createUUID(),
    ...cloneDeep(pageConfig)
  };
};
let copyPage = function (data) {
  let pageData = cloneDeep(data);
  pageData.uuid = createUUID();
  pageData.elements = pageData.elements.map((element) => {
    return copyElement(element, {}, 'page');
  });
  return pageData;
};

let getProjectConfig = function () {
  let project = cloneDeep(projectConfig);
  let onePage = getPageConfig();
  project.pages.push({
    ...onePage
  });
  return { ...project };
};

/**
 * 获取元素样式
 * @param styleObj
 * @param scalePoint 缩放比例
 */
let getCommonStyle = function (styleObj, scalingRatio = 1, flag) {
  let needUnitStr = [
    'width',
    'height',
    'top',
    'left',
    'paddingTop',
    'paddingLeft',
    'paddingRight',
    'paddingBottom',
    'marginTop',
    'marginLeft',
    'marginRight',
    'marginBottom',
    'borderWidth',
    'fontSize',
    // "fontFamily",
    'borderRadius',
    'letterSpacing'
    // "writingMode",
  ];
  let style = {};
  for (let key in styleObj) {
    if (needUnitStr.includes(key)) {
      style[key] = styleObj[key] * scalingRatio + 'px';
    } else {
      style[key] = styleObj[key];
    }
  }
  if (flag) {
    style.transform = `rotate(${styleObj.rotate}deg)`;
  }
  style.backgroundImage = style.backgroundImage
    ? `url(${style.backgroundImage})`
    : '';
  return style;
};

const getDataByKeyFromVideoData = (videoData, key) => {
  for (let i = 0; i < videoData.pages.length; i++) {
    const page = videoData.pages[i];
    for (let j = 0; j < page.elements.length; j++) {
      const element = page.elements[j];
      if (element.isFFImage && element.key === key) {
        return element;
      }
    }
  }

  return null;
};

const cloneToVideoData = (projectData) => {
  const videoData = {}; // 创建一个视频对象

  const { title, fps = 30, width, height } = projectData; // 获取视频对象的高度
  videoData.title = title;
  videoData.fps = fps;
  videoData.width = width;
  videoData.height = height;
  videoData.pages = []; // 创建页面

  videoData.audio = getMusicAudio(projectData);

  for (let i = 0; i < projectData.pages.length; i++) {
    const page = projectData.pages[i]; // 获取当前的画布
    const data = page.data; //
    data.backgroundColor = page.commonStyle.backgroundColor || '#000000';
    videoData.pages.push({
      data,
      elements: []
    });
  }
  return videoData;
};

const getMusicAudio = (projectData) => {
  let music;
  for (let i = 0; i < projectData.pages.length; i++) {
    const page = projectData.pages[i];
    for (let j = 0; j < page.elements.length; j++) {
      const element = page.elements[j];
      if (element.elName === 'qk-bg-music') {
        music = element.propsValue.musicSrc;
      }
    }
  }

  return music;
};

// 删掉音乐元素,并且按照z-index重新排序
const processingProjectData = (projectData) => {
  const newData = deepClone(projectData); ///
  for (let i = 0; i < newData.pages.length; i++) {
    const page = newData.pages[i];
    page.elements = sortBy(page.elements, (o) => o.commonStyle.zIndex);

    for (let j = page.elements.length - 1; j >= 0; j--) {
      const element = page.elements[j];
      if (element.elName === 'qk-bg-music') {
        page.elements.splice(j, 1);
      }
    }
  }

  return newData;
};

export default {
  elementConfig,
  pageConfig,
  projectConfig,
  getElementConfig,
  getPageConfig,
  getProjectConfig,
  copyPage,
  copyElement,
  getCommonStyle,
  cloneToVideoData,
  processingProjectData,
  getDataByKeyFromVideoData
};
