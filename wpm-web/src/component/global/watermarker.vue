<template>
  <div class="watermark-wrapper">
    <div class="watermark" ref="watermark"></div>
    <canvas id="myCanvas"></canvas>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        account: ''
      }
    },
    methods: {
      getUserAccount() {
        this.$getData.getUserAccout({
          method: 'post'
        }).then(res => {
          console.log(res.data.accountName)
          this.account = res.data.accountName
        })
      },
      initWaterMark(account) {
        // let htmlFontSize = Number(document.getElementsByTagName('html')[0].style.fontSize.split('px')[0]);
        // console.log("ddd",htmlFontSize);
        let visible_h = document.getElementById('app').clientWidth
        // var rHeight = this.$refs.watermark.offsetHeight
        // var rWidth = this.$refs.watermark.offsetWidth
        // var rDistance = Math.sin( -30 * Math.PI / 180) * rHeight * Math.cos(-30 * Math.PI / 180)

        var canvas = document.getElementById('myCanvas')
        canvas.width = 200 * visible_h / 375
        canvas.height = 200 * visible_h / 375
        var ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // ios device don't support rem
        ctx.font = 0.426 * 28 + 'px' + ' Noto Sans CJK SC Light, PingFangSC, PingFangSC-Regular ,Microsoft Himalaya'

        ctx.translate(100 * visible_h / 375, 100)
        ctx.rotate(-30 * Math.PI / 180)
        ctx.fillStyle = 'rgba(0, 15, 23, 0.2)'
        // ctx.fillStyle = '#f4f4f4'
        ctx.textAlign = 'center'
        ctx.fillText(('宏信建发' || ''), 0, 0);
        ctx.fillText((account || ''), 2, 15); //将名字接完接口存在localstorage里面，这里直接获取
        this.$refs.watermark.style.backgroundImage = 'url("' + ctx.canvas.toDataURL() + '")'
      }
    },
  }

</script>

<style lang="scss" scoped>
  .watermark {
    position: fixed;
    z-index: 2000;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    pointer-events: none;
  }

  canvas {
    display: none;
    border: 1px solid red;
    position: fixed;
    top: 180px;
    left: 100px;
    z-index: 19;
  }

</style>


