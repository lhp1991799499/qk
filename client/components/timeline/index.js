export default {
    name: 'timeline',
    props: {
      activePage: {
        type: Object,
        default: {}
      },
      activeElement: {
        type: undefined,
        default: ()=> {}
      }
    },
    mounted () { },
    data () {
      return {
        timeScale: 60 ,
        play: true, // 播放时间轴
        left: 0,
        maxTimeLine: 60, // 最大时间轴
        timebar: 0, // 时间轴
        eachLiWidth: 100, // 每个刻度宽度
        selectLayer: '',  
        banAnimate: 0,
        selectAnimotions: {},
        moveState: {},
        timelineheight: 200,
        showfooter: true,
        timeLineState: true
      }
    },
    methods: {
      /* 选中当前的某个动画 */
      selectElement(element, animate){
         this.selectAnimotions = {
            selectElement: element,
            selectAnimateUUID: animate.uuid
         }
         this.selectElementName(element)
      },
      
      // 根据动画时长计算元素距离
      sizeRevers(duration) {
        return duration * 100
      },

      /* 根据动画延迟 计算距离 */
      sizeDelay(delay) {
         return delay * 100
      },
 
      /* 移动当前的动画 */
      mousedownAnimate($event, element, animate, type, direction) {
         $event.stopPropagation();
         $event.preventDefault();
         this.moveState = JSON.parse(JSON.stringify({
          start : $event.clientX,
          element,   // 移动元素的id
          animate,    // 移动元素的动画id
          type,
          direction
        })) 
         document.addEventListener('mousemove', this.moveAnimate);
         document.addEventListener('mouseup', this.eventMouve);
      },
      
      /* 移动当前的动画 */
      moveAnimate(em){

        /* 计算鼠标移动距离 */
        let {start, element, animate, type, direction} = this.moveState;
        let x = em.clientX - start;
         
        let obj = {
          delay:this.delayMove,
          duration: this.durationMove
        }

        obj[type] && obj[type]( element, animate, x, direction)
      },
      
      /* 动画延迟距离转换时间*/
      delayMove(element, animate, x){
        let delay =  ( Number(animate.delay) + (x/100)).toFixed(1);
        if (delay < 0) delay = 0
        this.$emit('updateDelay', {
          elementUUId:element.uuid,  
          animateUUId:animate.uuid,
          animate: {delay: Number(delay)} 
        });
      },
      
      /* 动画时长距离 转换时间*/
      durationMove(element, animate, x, direction){
        if (direction === 'right') {
          let duration =  ( Number(animate.duration) + (x/100)).toFixed(1);
          if (duration < 0) duration = 0.1;
          this.$emit('updateDelay', {
            elementUUId:element.uuid,  
            animateUUId:animate.uuid, 
            animate: {duration: Number(duration)} 
          })
        } else {
           this.delayMove(element, animate, x);
           let duration =  ( Number(animate.duration) + (-x/100)).toFixed(1);
           if (duration < 0) duration = 0.1;
           this.$emit('updateDelay', {
            elementUUId:element.uuid,  
            animateUUId:animate.uuid, 
            animate: {duration: Number(duration)} 
           });
        }
      },
      
      /* 移除动画 */
      eventMouve(){
        document.removeEventListener('mousemove', this.moveAnimate);
        document.removeEventListener('mouseup', this.eventMouve);
      },

      /* 选中当前的元素 */
      selectElementName(element){
         this.$emit('selectElement',element.uuid)
      },


      /* 修改当前时间轴的高度 */
      moveTimeLine($event){
        $event.stopPropagation();
        $event.preventDefault();
        let start =  $event.clientY;
        let timelineheight = this.timelineheight; 
        let move = (ev) => {
           let x = -(ev.clientY - start);
           let line = timelineheight + x;
           if (line <= 0) {
             this.timelineheight = 0;
             this.showfooter = false;
             this.timeLineState = false;   //如果时间轴小于这个高度 时间轴状态关闭

           } else {
             if (this.$refs.timeLine.offsetTop <= 120) {
                if (line < this.timelineheight) {
                  this.timelineheight = line;
                }
             } else {
               line >= 500 ?  this.timelineheight = 500 : this.timelineheight = line;
               this.showfooter = true;
               this.timeLineState = true; //如果时间轴小于这个高度 时间轴状打开
             }
          
           }
        }
         
        let up = (ev) => {
          document.removeEventListener('mousemove', move);
          document.removeEventListener('mouseup', up);
        }
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up)
      },
      

      /* 删除元素 */
      deleteElement(el){
        this.$emit('deleteElement',el)
      },
      
      /* 复制当前元素 */
      copyElement(el){
        this.$emit('copyElement',el)
      },
     
      /* 滚动条滚动事件 */
      timeLineSliderScroll(e){
        let left = e.target.scrollLeft;
        this.left = left
      },
      
      /* 设置背景颜色 */
      countBgcColor(animation) {
         let obj = {
           '进场动画': '#5584FF',
           '强调动画':'#66E9D3',
           '退场动画':'#F6B25A'
         }
         return obj[animation.title] || '#5584FF'
      },
   
      /* 清除选中的元素 */
      clearSelectElement ($event) {
        $event.stopPropagation();
        $event.preventDefault();
        this.selectAnimotions = {}
      }
    }
}
