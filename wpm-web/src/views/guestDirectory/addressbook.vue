<template>
  <div class="wrap">
    <div class="addr-header">
      <div class="search-main">
        <i class="search-icon"></i>
        <div class="addr-search">
          <van-field  v-model="queryData.name" @input="delayGetAddresslist" />
        </div>
        <i class="close-icon" @click="clearInput"></i>
      </div>
      <span class="suredbtn" v-show="selectedArr[0]" @click="setData">确定</span>
    </div>
    <div class="addr-main">
      <div class="selected-area">
        <div
          class="user-li"
          v-for="(item,index) of selectedArr"
          :key="index"
          @click="deleteSel(item,index)"
        >
          <div class="avatar-info">
            <div class="under-ava">
              <!-- <span class="ava-img u-ava">
                <img src="../../../static/imgs/avatar.png" />
              </span>-->
              <span class="sele">已选</span>
              <span class="u-name">{{item.personName}}</span>
              <span class="account">({{item.account}})</span>
            </div>
            <!-- <div class="department">运营管理部</div> -->
          </div>
        </div>
      </div>
      <div class="select-tag">
        <div
          class="user-li"
          v-for="(item,index) of resData"
          :key="index"
          @click="changIndex(item,index)"
        >
          <span :class="item.selected ? 'radio-select' :''" class="radio"></span>
          <div class="avatar-info">
            <span class="ava-img">
              <!-- <img src="../../../static/imgs/avatar.png" /> -->
            </span>
            <div class="user-name">
              {{item.personName}}
              <span class="account">({{item.account}})</span>
            </div>
            <!-- <div class="department">运营管理部</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { getPersonMsgByAdName } from "@/apis/api/guestrecord";
import { getlocalStorage, setlocalStorage } from "@/utils/format";
import { Toast } from 'vant';
export default {
  data() {
    return {
      radioIndex: -1,
      queryData: {
        name: ""
      },
      resData: [],
      selectedArr: []
    };
  },
  beforeCreate() {
    document.title = "";
  },
  created() {
    this.delayGetAddresslist = _.debounce(this.getAddresslist, 300);
    this.defaultData();
  },
  mounted() {
    // this.getAddresslist();
  },
  methods: {
    defaultData() {
      this.selectedArr = getlocalStorage("selectedArr");
    },
    getAddresslist() {
     getPersonMsgByAdName(this.queryData).then(res => {
        this.resData = res.data ? res.data : [];
        this.showSelected();
      });
    },
    changIndex(item, index) {
      if (this.resData[index].selected) {
        this.selectedArr.splice(this.selectedArr.findIndex(v => v.account === this.resData[index].account),1);
      } else {
        this.selectedArr = [...this.selectedArr, item];
      }
      this.resData[index].selected = this.resData[index].selected
        ? false
        : true;
    },
    showSelected() {
      //搜索选中
      if (this.selectedArr[0]) {
        this.selectedArr.forEach((item, index) => {
          this.resData.forEach(ele => {
            if (item.account === ele.account) {
              ele.selected = true;
            }
          });
        });
      }
    },
    setData() {
      if(this.selectedArr.length > 50){
        Toast('最多可选50人')
        return;
      }
      localStorage.setItem("selectedArr", JSON.stringify(this.selectedArr));
      this.$router.push("visitorDetail");
    },
    deleteSel(item, index) {
      this.selectedArr.splice(index, 1);
      localStorage.setItem("selectedArr", JSON.stringify(this.selectedArr));
      this.resData.forEach((ele, index) => {
        if (item.account === ele.account) ele.selected = false;
      });
    },
    clearInput() {
      this.queryData.name = "";
    }
  }
};
</script>
<style lang="scss">
.addr-search {
  .van-cell {
    padding: 0px;
    background: transparent;
    padding-left: 5px;
    border: none;
    input {
      color: #fff;
      font-weight: 15px;
      padding-top: 4px;
    }
  }
}
</style>
<style lang="scss" scoped>
.addr-header {
  display: flex;
  background: #4b77af;
  height: 64px;
  span.suredbtn {
    margin-left: 5px;
    color: #fff;
    width: 50px;
    font-size: 15px;
    vertical-align: middle;
    line-height: 68px;
  }
}
.search-main {
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
  width: 100%;
  border-radius: 12px;
  margin: 17px 8px 0 8px;
  display: flex;
  i {
    width: 45px;
    height: 30px;
  }
  .search-icon {
    background: url(../../../static/imgs/search.png) no-repeat 15px center;
    background-size: 20px 18px;
  }
  .close-icon {
    background: url(../../../static/imgs/close-c.png) no-repeat left;
    background-size: 24px 24px;
  }
}
.search-click {
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
  width: 100%;
  border-radius: 12px;
  margin: 17px 20px 0 20px;
  text-align: center;
  .search-icon {
    height: 30px;
    background: url(../../../static/imgs/search.png) no-repeat center;
    background-size: 20px 18px;
    display: inline-block;
  }
  span {
    line-height: 30px;
    padding-left: 58px;
  }
}
.addr-search {
  height: 31px;
  width: 100%;
}
.radio {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid #4b77af;
  margin: 3px 15px 3px 9px;
  display: block;
  flex-shrink: 0;
}
.radio-select {
  width: 19px;
  height: 19px;
  display: block;
  margin: 3px 15px 3px 9px;
  background: url(../../../static/imgs/option-s.png) no-repeat center;
  background-size: 19px 19px;
  flex-shrink: 0;
  border: none;
}
.selected-area {
  & > .user-li {
    padding: 8px 0 8px 26px;
    // height: 60px;
  }
  .department {
    line-height: 60px;
  }
}
.user-li {
  height: 30px;
  line-height: 30px;
  display: flex;
  padding: 15px 0;
  font-size: 17px;
  border-bottom: 1px solid rgba(75, 119, 175, 0.2);
}
.avatar-info {
  display: flex;
  width: 100%;
}
.ava-img,
.ava-img img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex: 0;
}
.sele{
  font-size: 12px;
  color: #4b77af;
  border: 1px solid #4b77af;
  padding: 0 6px;
  border-radius: 4px;
}
.under-ava{
  margin-left: -10px;
}
.user-name {
  margin-left: 5px;
}
.department {
  color: #f4f4f4;
  flex: 1;
  text-align: right;
  padding-right: 16px;
}
.account {
  font-size: 13px;
  color: #959595;
  padding-left: 5px;
}
</style>
