// /*
//  * @version:
//  * @Author: leaolly
//  * @Date: 2023-03-22 09:35:06
//  * @LastEditors: Please set LastEditors
//  * @LastEditTime: 2023-06-12 09:59:01
//  * @Descripttion: 模块描述
//  */
// /**
//  * 动画方法， 将动画css加入到元素上，返回promise提供执行后续操作（将动画重置）
//  * @param $el 当前被执行动画的元素
//  * @param animationList 动画列表
//  * @param isDebugger 动画列表
//  * @returns {Promise<void>}
//  */
// export default async function runAnimation(
//   $el,
//   animationList = [],
//   isDebug,
//   name,
//   callback
// ) {
//   let playFn = function (animation) {
//     return new Promise((resolve) => {
//       let animationName = '';
//       if (name == '进场动画') {
//         animationName = 'enter';
//       } else if (name == '强调动画') {
//         animationName = 'emphasize';
//       } else if (name == '退场动画') {
//         animationName = 'exit';
//       }
//       $el.style.animationName = animation.type;
//       $el.style.animationDuration = `${animation.duration}s`;
//       // $el.style.animationName = animationList[0].type;
//       // $el.style.animationDuration = `${animationList[0].duration}s`;

//       // 如果是循环播放就将循环次数置为1，这样有效避免编辑时因为预览循环播放组件播放动画无法触发animationend来暂停组件动画
//       $el.style.animationIterationCount = animation.infinite
//         ? isDebug
//           ? 1
//           : 'infinite'
//         : animation.interationCount;
//       $el.style.animationDelay = `${animation.delay}s`;
//       $el.style.animationFillMode = 'both';
//       let resolveFn = function () {
//         $el.removeEventListener('animationend', resolveFn, false);
//         $el.removeEventListener('animationcancel', resolveFn, false);
//         resolve();
//       };
//       $el.addEventListener('animationend', resolveFn, false);
//       $el.addEventListener('animationcancel', resolveFn, false);
//     });
//   };

//   for (var arr in animationList[0]) {
//     await playFn(animationList[0][arr]);
//   }

//   // for (let i = 0, len = animationList.length; i < len; i++) {
//   //   console.log(animationList[0]);
//   //   await playFn(animationList);
//   // }
//   if (callback) {
//     callback();
//   }
// }
/*
 * @version:
 * @Author: leaolly
 * @Date: 2023-06-08 09:42:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-12 09:45:38
 * @Descripttion: 模块描述
 */
/**
 * 动画方法， 将动画css加入到元素上，返回promise提供执行后续操作（将动画重置）
 * @param $el 当前被执行动画的元素
 * @param animationList 动画列表
 * @param isDebugger 动画列表
 * @returns {Promise<void>}
 */
export default async function runAnimation(
  $el,
  animationList = [],
  isDebug,
  name,
  callback
) {
  let playFn = function (animation) {
    return new Promise((resolve) => {
      $el.style.animationName = animation.type;
      $el.style.animationDuration = `${animation.duration}s`;
      // 如果是循环播放就将循环次数置为1，这样有效避免编辑时因为预览循环播放组件播放动画无法触发animationend来暂停组件动画
      $el.style.animationIterationCount = animation.infinite
        ? isDebug
          ? 1
          : 'infinite'
        : animation.interationCount;
      $el.style.animationDelay = `${animation.delay}s`;
      $el.style.animationFillMode = 'both';
      let resolveFn = function () {
        $el.removeEventListener('animationend', resolveFn, false);
        $el.removeEventListener('animationcancel', resolveFn, false);
        resolve();
      };
      $el.addEventListener('animationend', resolveFn, false);
      $el.addEventListener('animationcancel', resolveFn, false);
    });
  };
  for (let i = 0, len = animationList.length; i < len; i++) {
    await playFn(animationList[i]);
  }
  if (callback) {
    callback();
  }
}