import { cloneDeep, merge } from 'lodash';
import editorProjectConfig from '@client/pages/editor/DataModel';
import { Element } from 'element-ui';
import json from 'koa-json';
import Vue from '@/main.js';
import { createUUID } from './../../../common/uitls';
/**
 * 编辑器数据状态存储
 */
const state = {
  // 当前编辑器编辑工程项目数据
  projectData: {},
  // 当前正在编辑的页面uuid
  activePageUUID: '',
  // 画板中选中的元素uuid
  activeElementUUID: '',
  // 历史操作数据用于undo redo
  historyCache: [],
  // redo undo 指针
  currentHistoryIndex: 0,
  activeAttrEditCollapse: ['1'],
  activeImg: {},
  activeImgs: [],
  musicData: {}, //当前正在播放的音乐数据
  transformScalce: 1, //整体缩放
  activePageBorderUUID: '', // 画板选中之后边框线展示
  editor: null
};
const actions = {
  /**
   * 初始化编辑项目数据
   * @param state
   * @param data
   */
  setPrjectData({ commit, state, dispatch }, data) {
    let projectData = data;
    if (!projectData) {
      projectData = editorProjectConfig.getProjectConfig();
    }
    commit('setPrjectData', projectData);
    // 判断如果有页面择选中第一个没有则新建一个页面再选中第一个
    if (!state.projectData.pages || !state.projectData.pages.length) {
      dispatch('addPage');
    }

    dispatch('setActivePageUUID', state.projectData.pages[0].uuid);

    dispatch('setHistoryCache', true);
  },
  // 初始进入页面 把空数据 赋值给历史操作数据
  setHistoryCache({ commit }, flag) {
    commit('setHistoryCache', flag);
  },

  /**
   * 设置当前选中页面uuid
   * @param state
   * @param data
   */
  setActivePageUUID({ commit }, uuid) {
    commit('setActivePageUUID', uuid);
    // 当前选中页面切换后清空元素选中的uuid
    commit('setActiveElementUUID', '');
  },
  /**
   * 设置当前选中激活元素uuid
   * @param state
   * @param data
   */
  setActiveElementUUID({ commit }, uuid) {
    commit('setActiveElementUUID', uuid);
  },
  // ========================项目操作=========================
  /**
   *
   * @param commit
   * @param url
   */
  updateCoverImage({ commit }, url) {
    commit('updateCoverImage', url);
  },

  // =====================页面操作============================
  /**
   * 添加页面
   * @param commit
   */
  addPage({ commit }, uuid) {
    let data = editorProjectConfig.getPageConfig();
    let index = -1;
    if (uuid) {
      index = state.projectData.pages.findIndex((v) => {
        return v.uuid === uuid;
      });
    } else {
      index = state.projectData.pages.length - 1;
    }

    commit('insertPage', { data: data, index: index });
    commit('addHistoryCache');
  },

  // 画布上下移动
  canvasMove({ commit }, obj) {
    console.log(obj);
    let pageData = state.projectData.pages.find((v, index) => {
      return v.uuid === obj.uuid;
    });
    let data = editorProjectConfig.copyPage(pageData);
    let index = -1;
    if (obj.uuid) {
      index = state.projectData.pages.findIndex((v) => {
        return v.uuid === obj.uuid;
      });
    } else {
      index = state.projectData.pages.length - 1;
    }

    commit(obj.type, { data: data, index: index });
    commit('addHistoryCache');
  },
  /**
   * 删除页
   * @param commit
   * @param dispatch
   * @param uuid
   */
  deletePage({ state, commit, dispatch }, uuid) {
    let index = state.projectData.pages.findIndex((v) => {
      return v.uuid === uuid;
    });

    // 如果删除最后一页
    if (state.projectData.pages.length === 1 && state.activePageUUID === uuid) {
      // commit('deletePage', index);
      // dispatch('addPage');
      // commit('setActivePageUUID', state.projectData.pages[0].uuid);
      // 如果是最后一张图片 清空所有的元素 恢复800像素
      commit('clearElement', uuid);
      commit('addHistoryCache');
      return;
    }
    // 删除页是第一页且选中也是第一页时 先将选中uuid置为下一页再删除当前页
    // if (state.projectData.pages[0] === uuid && state.activePageUUID === uuid) {
    //   commit('setActivePageUUID', state.projectData.pages[1].uuid);
    // }

    // 删除之后 设置上一页的uuid  如果是删除的第一页 接设置下一页
    let setIndex = index == 0 ? 1 : index - 1;

    commit('setActivePageUUID', state.projectData.pages[setIndex].uuid);
    commit('deletePage', index);

    commit('addHistoryCache');
  },
  /**
   * 复制页面
   * @param commit
   * @param uuid
   */
  copyPage({ commit }, uuid) {
    let pageIndex = 0; //记录复制的是第几张画布
    let pageData = state.projectData.pages.find((v, index) => {
      if (v.uuid == uuid) {
        pageIndex = index;
      }
      return v.uuid === uuid;
    });
    let data = editorProjectConfig.copyPage(pageData);
    commit('insertPage', { data: data, index: pageIndex });
    commit('addHistoryCache');
  },

  // =============================元素相关========================================

  /**
   * 添加元素
   * @param commit
   * @param data
   */
  addElement({ commit }, elData) {
    let activePage = getters.activePage(state);
    let data = editorProjectConfig.getElementConfig(elData, {
      zIndex: activePage.elements.length + 1,
      textShadow: elData.css3 ? elData.css3.textShadow : ''
    });
    commit('addElement', {
      ...data
    });
    commit('setActiveElementUUID', data.uuid);
    commit('addHistoryCache');
  },
  /**
   * 元素指令， 用于结束针对元素修改相关指令，再由此方法派发actions做具体修改
   * @param dispatch
   * @param type
   * @param data
   */
  elementCommand({ commit, dispatch, state }, command) {
    let elData = getters.activeElement(state);
    if (elData.commonStyle.lock) {
      // 判断是否是锁定状态 如果是 将不能做任何操作
      return;
    }
    switch (command) {
      case 'copy':
        dispatch('copyElement', elData);
        break;
      case 'delete':
        dispatch('deleteElement', elData.uuid);
        break;
      case 'fontA+':
        dispatch('resetElementCommonStyle', {
          fontSize: elData.commonStyle.fontSize + 1
        });
        break;
      case 'fontA-':
        dispatch('resetElementCommonStyle', {
          fontSize: elData.commonStyle.fontSize - 1
        });
        break;
      case 'fontB':
        dispatch('resetElementCommonStyle', {
          fontWeight:
            elData.commonStyle.fontWeight === 'bold' ? 'normal' : 'bold'
        });
        break;
      case 'fontULine':
        dispatch('resetElementCommonStyle', {
          textDecoration:
            elData.commonStyle.textDecoration === 'underline' ? '' : 'underline'
        });
        break;
      case 'fontItalic':
        dispatch('resetElementCommonStyle', {
          fontStyle: elData.commonStyle.fontStyle === 'italic' ? '' : 'italic'
        });
        break;
      case 'fontCLine':
        dispatch('resetElementCommonStyle', {
          textDecoration:
            elData.commonStyle.textDecoration === 'line-through'
              ? ''
              : 'line-through'
        });
        break;
      case 'letterSpacing':
        dispatch('resetElementCommonStyle', {
          letterSpacing: elData.commonStyle.letterSpacing
        });
        break;
      case 'lineHeight':
        dispatch('resetElementCommonStyle', {
          lineHeight: elData.commonStyle.lineHeight + 'px'
        });
        break;
      case 'layerUp':
        commit('resetElementZIndex', { uuid: elData.uuid, type: 'layerUp' });
        commit('addHistoryCache');
        break;
      case 'layerDown':
        commit('resetElementZIndex', { uuid: elData.uuid, type: 'layerDown' });
        commit('addHistoryCache');
        break;
      case 'layerTop':
        commit('resetElementZIndex', { uuid: elData.uuid, type: 'layerTop' });
        commit('addHistoryCache');
        break;
      case 'layerBottom':
        commit('resetElementZIndex', {
          uuid: elData.uuid,
          type: 'layerBottom'
        });
        commit('addHistoryCache');
        break;
      default:
        break;
    }
  },
  changeFont({ commit, dispatch, state }, font) {
    dispatch('resetElementCommonStyle', {
      fontFamily: font.name,
      statusHistory: false
    });
    commit('resetFontType', font);
    commit('addHistoryCache');
  },
  copyElement({ state, commit }, elData) {
    let copyOrignData = elData ? elData : getters.activeElement(state);
    let activePage = getters.activePage(state);
    let data = editorProjectConfig.copyElement(copyOrignData, {
      zIndex: activePage.elements.length + 1
    });

    commit('addElement', data);
    commit('setActiveElementUUID', data.uuid);
    commit('addHistoryCache');
  },
  deleteElement({ state, commit }, uuid) {
    console.log(state, uuid);
    // 如果删除选中元素则取消元素选中
    if (uuid === state.activeElementUUID) {
      commit('setActiveElementUUID', '');
    }
    // 先将页面元素zIndex 重置下再删除元素
    commit('resetElementZIndex', { uuid: uuid, type: 'set0' });

    commit('deleteElement', uuid);
    commit('addHistoryCache');
  },
  resetElementCommonStyle({ commit }, style) {
    commit('resetElementCommonStyle', style);
    if (style.statusHistory !== false) {
      commit('addHistoryCache');
    }
    // commit('addHistoryCache');
  },
  /**
   * 添加动画到元素上
   * @param commit
   * @param animationName
   */
  addElementAnimate({ commit }, animationName) {
    let delay = 0;
    let activeElement = getters.activeElement(state);
    // 初始化数据
    let animateDefaultData = {};

    animateDefaultData = {
      type: animationName.animations,
      duration: 1.5,
      infinite: '',
      interationCount: 1,
      delay: delay,
      title: animationName.title,
      label: animationName.label,
      uuid: createUUID()
    };
    commit('addElementAnimate', animateDefaultData);
    commit('addHistoryCache');
  },
  /**
   * 删除动画
   * @param commit
   * @param index
   */
  deleteElementAnimate({ commit }, animation) {
    commit('deleteElementAnimate', animation);
    commit('addHistoryCache');
  },

  /**
   * 添加事件
   * @param commit
   * @param type
   */
  addElementEvent({ commit }, type) {
    // 初始化数据
    let eventDefaultData = {
      type: type,
      url: ''
    };
    commit('addElementEvent', eventDefaultData);
    commit('addHistoryCache');
  },
  /**
   * 删除事件
   * @param commit
   * @param index
   */
  deleteElementEvent({ commit }, index) {
    commit('deleteElementEvent', index);
    commit('addHistoryCache');
  },

  // =====================历史纪录=======================
  /**
   * 记入历史纪录
   * @param commit
   * @param index 插入到index后
   */
  addHistoryCache({ commit }) {
    commit('addHistoryCache');
  },
  editorUndo({ commit, state }) {
    if (!getters.canUndo(state)) {
      return;
    }

    const prevState = state.historyCache[state.currentHistoryIndex - 1];
    if (
      prevState.projectData.pages.length == 1 &&
      prevState.projectData.pages[0].elements.length == 1
    ) {
      console.log(1);
      // prevState.projectData.pages.elements = [];
    }
    // 每次撤回都刷新组件
    Vue.$bus.$emit('refreshEditorMainKey');
    if (prevState.projectData.pages.length == 1) {
      prevState.activeElementUUID = '';
    }
    commit('relapceEditorState', cloneDeep(prevState));
    commit('editorUndo');
  },
  editorRedo({ commit }) {
    if (!getters.canRedo(state)) {
      return;
    }
    const prevState = state.historyCache[state.currentHistoryIndex + 1];
    // 每次撤回都刷新组件
    Vue.$bus.$emit('refreshEditorMainKey');

    if (prevState.projectData.pages.length == 1) {
      prevState.activeElementUUID = '';
    }
    commit('relapceEditorState', cloneDeep(prevState));
    commit('editorRedo');
  },
  // 改变音乐
  musicChange({ commit }, data) {
    commit('musicChange', data);
  },
  changeDivText({ commit }, data) {
    commit('changeDivText', data);
  }
};
const mutations = {
  getEditor(state, uuid) {
    state.editor = document.getElementById(uuid);
  },
  // 给选中的画布添加 border
  setActivePageBorderUUID(state, UUID) {
    state.activePageBorderUUID = UUID;
  },
  // 修改背景颜色
  pageBackgroundColorChange(state, color) {
    // console.log(state.projectData.pages[0].commonStyle.backgroundColor);
    // state.projectData.pages[0].commonStyle.backgroundColor = color;
  },
  /* 修改当前动画的  延迟 动画时长*/
  setAnimateDelayAndDuration(
    state,
    { elementUUId, animateUUId, animate: { delay, duration } }
  ) {
    let page = state.projectData.pages.find(
      (page) => page.uuid === state.activePageUUID
    );
    let el = page.elements.find((el) => el.uuid === elementUUId);
    let an = el.animations.find((animate) => animate.uuid === animateUUId);

    delay
      ? (an.delay = delay)
      : delay === 0
      ? (an.delay = delay)
      : (an.delay = an.delay);
    duration
      ? (an.duration = duration)
      : duration == 0
      ? (an.duration = duration)
      : (an.duration = an.duration);
    // an.delay = delay === 0 ? delay : false || an.delay;
    // an.duration = duration || an.duration;
  },
  // 整体缩放
  transformScalce(state, num) {
    state.transformScalce = num;
  },

  setImgActive(state, url) {
    let activeElement = getters.activeElement(state);
    activeElement.propsValue.imageSrc = url;
  },
  setImgs(state, data) {
    state.activeImgs.push(data);
  },
  setPrjectData(state, data) {
    state.projectData = data;
  },
  setActivePageUUID(state, data) {
    // 设置uuid  判断是否在数据中
    let UUID = JSON.stringify(state.projectData.pages).indexOf(data);
    if (UUID != -1) {
      state.activePageUUID = data;
    }
  },
  setHistoryCache(state, data) {
    let obj = {
      activePageUUID: state.activePageUUID,
      activeElementUUID: state.activeElementUUID,
      projectData: cloneDeep(state.projectData)
    };
    state.historyCache.push(obj);
  },
  setActiveElementUUID(state, data) {
    state.activeElementUUID = data;
    // 每次选中元素 都会让画板边框清除
    state.activePageBorderUUID = '';
  },
  /**
   * 更新项目主图
   * @param commit
   * @param url
   */
  updateCoverImage(state, url) {
    state.projectData.coverImage = url;
  },
  /**
   * 新增页面
   */
  insertPage(state, obj) {
    state.projectData.pages.splice(obj.index + 1, 0, obj.data);
    // if (obj.index) {
    //   console.log(1);
    //   state.projectData.pages.splice(obj.index + 1, 0, obj.data);
    // } else {
    //   state.projectData.pages.push(obj.data);
    // }
  },
  // 页面下移
  pageDown(state, obj) {
    if (state.projectData.pages.length > obj.index) {
      let pageData = state.projectData.pages[obj.index];
      //判断是否是最后一个
      state.projectData.pages.splice(obj.index, 1);
      state.projectData.pages.splice(obj.index + 1, 0, pageData);
    }
  },
  // 页面上移
  pageUp(state, obj) {
    if (obj.index > 0) {
      let pageData = state.projectData.pages[obj.index];
      //判断是否是第一个
      state.projectData.pages.splice(obj.index, 1);
      state.projectData.pages.splice(obj.index - 1, 0, pageData);
    }
  },
  /**
   * 删除页面
   */
  deletePage(state, index) {
    state.projectData.pages.splice(index, 1);
  },

  // =============================元素相关========================================

  /**
   * 往画板添加元素
   * @param state
   * @param elData
   */
  addElement(state, elData) {
    // 解决增加文字之后背景颜色为白色问题
    elData.commonStyle.backgroundColor = '';
    let index = state.projectData.pages.findIndex((v) => {
      return v.uuid === state.activePageUUID;
    });
    state.projectData.pages[index].elements.push(elData);
  },
  /**
   * 往画板添加元素
   * @param state
   * @param elData  activeElementIndex
   */
  deleteElement(state, uuid) {
    let activePage = getters.activePage(state);
    let elementIndex = activePage.elements.findIndex((v) => {
      return v.uuid === uuid;
    });
    if (activePage.elements[elementIndex].commonStyle.lock) return;
    activePage.elements.splice(elementIndex, 1);
  },
  clearElement(state, uuid) {
    let activePage = getters.activePage(state);
    activePage.elements = [];
    activePage.commonStyle = {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      backgroundImage: '',
      backgroundSize: 'cover',
      elName: '',
      height: 800
    };
  },
  /**
   * 重置元素样式，
   * @param commit
   * @param uuid
   * @param styleObject
   */
  resetElementCommonStyle(state, style) {
    let activeElement = getters.activeElement(state);
    activeElement.commonStyle = merge(activeElement.commonStyle, style);
  },

  /**
   * 添加动画到元素上
   * @param state
   * @param data
   */
  addElementAnimate(state, data) {
    let activeElement = getters.activeElement(state);
    let ElementAnimate = activeElement.animations.find((v) => {
      return v.title === data.title;
    });
    ElementAnimate ? this.commit('deleteElementAnimate', ElementAnimate) : '';

    let delay = 0;
    let index = activeElement.animations.length - 1;
    // 如果存在动画 新增的动画延迟就在动画最后  如果没有动画  就让动画延迟为0
    if (activeElement.animations.length >= 1) {
      delay =
        activeElement.animations[index].duration +
        activeElement.animations[index].delay;
    }
    data.delay = delay;

    activeElement.animations.push(data);
  },
  /**
   * 删除动画到元素上
   * @param state
   * @param index
   */
  deleteElementAnimate(state, animation) {
    let activeElement = getters.activeElement(state);
    // 删除时传入此动画，找到索引进行删除
    const index = activeElement.animations.findIndex(
      (item) => item === animation
    );
    activeElement.animations.splice(index, 1);
    // delete activeElement.animations[index];
  },
  /**
   * 添加事件
   * @param state
   * @param data
   */
  addElementEvent(state, data) {
    let activeElement = getters.activeElement(state);
    activeElement.events.push(data);
  },
  /**
   * 删除事件
   * @param state
   * @param index
   */
  deleteElementEvent(state, index) {
    let activeElement = getters.activeElement(state);
    activeElement.events.splice(index, 1);
  },
  // 元素是否锁定
  toggleLockElement(state, data) {
    let activeElement = getters.activeElement(state);
    activeElement.lock = data;
  },

  /**
   * 改变元素zIndex
   * @param state
   * @param uuid
   * @param type layerUp上一层，layerDown下一层，layerTop置顶， layerBottom置底
   */
  resetElementZIndex(state, { uuid, type }) {
    uuid = uuid || state.activeElementUUID;
    let activePage = getters.activePage(state);
    let currentElement = activePage.elements.find((v) => {
      return v.uuid === uuid;
    });
    console.log(state, activePage);

    let itemZIndex = currentElement.commonStyle.zIndex;
    let maxIndex = activePage.elements.length;
    let mminIndex = 1;
    let zIndexDirc = {
      layerUp: Math.min(itemZIndex + 1, maxIndex),
      layerDown: Math.max(itemZIndex - 1, mminIndex),
      layerTop: maxIndex,
      layerBottom: mminIndex,
      set0: 0
    };

    if (zIndexDirc[type] === undefined) return;
    let currentZIndex = zIndexDirc[type];
    currentElement.commonStyle.zIndex = currentZIndex;
    activePage.elements.forEach((item, index) => {
      if (uuid === item.uuid) return;

      // 上面一位zIndex减一
      if (type === 'layerUp' && item.commonStyle.zIndex === currentZIndex) {
        console.log(item);
        item.commonStyle.zIndex--;
      }
      // 下面元素zIdex加一
      if (type === 'layerDown' && item.commonStyle.zIndex === currentZIndex) {
        item.commonStyle.zIndex++;
      }
      // 目标元素zIndex 以上的都减一
      if (type === 'layerTop' && item.commonStyle.zIndex > itemZIndex) {
        item.commonStyle.zIndex--;
      }

      // 目标元素zIndex以下的都加一
      if (
        (type === 'layerBottom' || type === 'set0') &&
        item.commonStyle.zIndex < itemZIndex
      ) {
        item.commonStyle.zIndex++;
      }
    });
  },

  // ================================历史纪录========================================
  /**
   * 新增一条历史纪录
   * @param state
   */
  addHistoryCache(state) {
    if (state.currentHistoryIndex + 1 < state.historyCache.length) {
      state.historyCache.splice(state.currentHistoryIndex + 1);
    }
    state.historyCache.push({
      projectData: cloneDeep(state.projectData),
      activePageUUID: state.activePageUUID,
      activeElementUUID: state.activeElementUUID
    });
    // 限制undo 纪录步数，最多支持100步操作undo
    state.historyCache.splice(100);
    state.currentHistoryIndex++;
  },
  /**
   *
   * @param state
   */
  editorUndo(state) {
    state.currentHistoryIndex--;
  },
  /**
   *
   * @param state
   */
  editorRedo(state) {
    state.currentHistoryIndex++;
  },
  /**
   * 更新编辑器项目数据，从history中拿数据替换
   * @param state
   * @param data
   */
  relapceEditorState(state, data) {
    state.projectData = cloneDeep(data.projectData);
    state.activePageUUID = data.activePageUUID;
    state.activeElementUUID = data.activeElementUUID;
  },
  /**
   * 设置编辑属性折叠面板展开收起状态
   * @param state
   * @param data
   */
  updateActiveAttrEditCollapse(state, data) {
    state.activeAttrEditCollapse = data;
  },
  // 改变当前选择的音乐
  musicChange(state, data) {
    state.musicData = data;
  },
  changeDivText(state, data) {
    let elData = getters.activeElement(state);
    console.log(elData, data);
    elData.propsValue.text = data;
  },
  // 蒙版发生变化
  changeWebKitMask(state, data) {
    let elData = getters.activeElement(state);
    elData.propsValue.WebkitMask = data;
  },
  // 更改字体样式
  resetFontType(state, font) {
    let activeElement = getters.activeElement(state);
    activeElement.propsValue.font = font.name;
    activeElement.propsValue.ttf = font.content.ttf;
  },
  // 设置动画时长
  setVideoDuration(state, duration) {
    let activePage = getters.activePage(state);
    activePage.data.duration = duration;
  },
  // 设置蒙版样式
  resetWebkitMaskStyle(state, style) {
    let activePage = getters.activePage(state);
    activePage.elements.forEach((item) => {
      if (item.uuid == style.uuid) {
        item.commonStyle.webkitMaskStyle = merge(
          item.commonStyle.webkitMaskStyle,
          style
        );
      }
    });
  }
};
const getters = {
  /**
   * 当前选中的页面index
   * @param state
   * @returns {*}
   */
  currentPageIndex(state) {
    // 如果不存在页面返回-1
    if (!state.projectData.pages) {
      return -1;
    }
    return state.projectData.pages.findIndex((v) => {
      return v.uuid === state.activePageUUID;
    });
  },
  /**
   * 当前选中的页面index
   * @param state
   * @returns {*}
   */
  activeElementIndex(state) {
    // 如果不存在页面返回-1
    if (!state.projectData.pages) {
      return -1;
    }
    let currentPageIndex = state.projectData.pages.findIndex((v) => {
      return v.uuid === state.activePageUUID;
    });
    if (currentPageIndex === -1) {
      return -1;
    }
    return state.projectData.pages[currentPageIndex].elements.findIndex((v) => {
      return v.uuid === state.activeElementUUID;
    });
  },
  /**
   * 当前选中的页面
   */
  activePage() {
    // 如果不存在页面返回-1
    if (!state.projectData.pages || !state.activePageUUID) {
      return { commonStyle: {}, config: {} };
    }

    let UUID = JSON.stringify(state.projectData.pages).indexOf(
      state.activePageUUID
    );

    if (UUID != -1) {
      return state.projectData.pages.find((v) => {
        return v.uuid === state.activePageUUID;
      });
    }
  },
  /**
   * 当前选中元素
   */
  activeElement() {
    // 如果不存在页面返回-1
    if (!state.projectData.pages) {
      return { commonStyle: {}, propsValue: {}, elname: '' };
    }

    let currentPageIndex = state.projectData.pages.findIndex((v) => {
      return v.uuid === state.activePageUUID;
    });
    if (currentPageIndex === -1) {
      return { commonStyle: {}, propsValue: {}, elname: '' };
    }

    return state.projectData.pages[currentPageIndex].elements.find((v) => {
      return v.uuid === state.activeElementUUID;
    });
  },
  canUndo(state) {
    return state.currentHistoryIndex > 0;
  },
  canRedo(state) {
    return state.historyCache.length > state.currentHistoryIndex + 1;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
