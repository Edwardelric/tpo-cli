<template>
  <section class="store" v-if="originData.length > 0">
    <header class="header text-center" @click.prevent.stop="tabFn(0)" :class="{selected: selectedIndex !== null, contentSelected: subSelectedIndex != null}">
      <span v-if="subSelectedIndex === null">全部区域</span>
      <span v-if="subSelectedIndex !== null">{{areaList[subSelectedIndex].distName}}</span>
      <img src="../assets/imgs/store/arrow-down.png" />
      <img src="../assets/imgs/store/arrow-up.png" />
      <img src="../assets/imgs/store/arrow-down-light.png" />
    </header>
    <ul class="area-select-wrapper" :class="{active: selectedIndex === 0}">
      <li v-for="(item, index) in areaList" :key="index" @click.prevent.stop="tabContentFn(item, index)" :class="{active: subSelectedIndex === index}">{{item.distName}}</li>
    </ul>
    <ul class="store-wrapper">
      <li class="flex store-item" v-for="(item, index) in storeList" :key="index" @click.prevent.stop="selectStore(item)" :class="{active: item.storeId * 1 === selectedStoreId * 1}">
        <dl>
          <dt class="ellipsis">
            <span>{{item.storeName}}</span>
            <i v-if="item.showTips && item.showTips * 1 === 2">常去</i>
          </dt>
          <dd>{{item.address}}</dd>
        </dl>
        <span v-show="item.distanceFromMe > 0">{{(item.distanceFromMe * 1 / 1000).toFixed(2)}}km</span>
        <div class="right-icon">
          <img src="../assets/imgs/store/right.png"/>
        </div>
      </li>
    </ul>
    <div class="mask" :class="{active: selectedIndex === 0}" @click="closeMask"></div>
  </section>
</template>

<script type="text/ecmascript-6">
  import {getQueryString} from '../../../utils/common';
  export default {
    data() {
      return {
        baseParams: {},                 // 基础数据
        getDataPromise: null,           // promise 请求
        originData: [],                 // 原始数据
        areaList: [],                   // 区域数据
        storeList: [],                  // 门店数据
        selectedIndex: null,            // 是否下拉
        subSelectedIndex: null,         // 区域选择索引值
        selectedStoreId: null,          // 门店选择id
        params: {},                     // 请求参数
        isDebug: false
      }
    },
    created() {
      let urlParams = getQueryString('forwardUrl', 'domain', 'storeId', 'ssCodes', 'spuCode', 'cityName', 'latitude', 'longitude') || {};
      this.baseParams.forwardUrl = urlParams.forwardUrl;
      if (!this.checkParams(true, 'forwardUrl')) {
        return false;
      }

      this.baseParams.forwardUrl = decodeURIComponent(this.baseParams.forwardUrl);
      this.baseParams.domain = urlParams.domain || window.location.host;

      !this.baseParams.domain && this.toast('请返回上一个页面访问');
      this.baseParams.isHjia = /h.jia.chexiang/g.test(this.baseParams.domain) ? true : false;

      this.selectedStoreId = parseInt(urlParams.storeId) || null;

      // 请求门店数据
      let ajaxUrl = '/store/mylist/1.htm';
      let params = this.params;
      if (this.baseParams.isHjia) {
        // h.jia.chexiang 请求参数
        params.ssCodes = urlParams.ssCodes;
        params.spuCode = urlParams.spuCode;
      } else if (!this.baseParams.isHjia) {
        // cxj.activity.chexiang 请求参数
        params.cityName = urlParams.cityName;
        params.latitude = urlParams.latitude;
        params.longitude = urlParams.longitude;
        ajaxUrl = '/service/fuliv2/store/storeList';
      }
      this.getDataPromise = this.$ajax.get(ajaxUrl, {params});
    },
    mounted() {
      if (window.lb) {
        // 隐藏分享菜单
        lb.hideMenu();
      }
      if (!this.getDataPromise) {
        return false;
      }
      let tmpArr = [];
      this.getDataPromise.then((res) => {
        this.originData = res.obj.storeList;
        this.areaList.push({
          distId: 0,
          distName: '全部区域'
        });
        this.originData.forEach((item, index) => {
          if (!index) {
            item.showTips = res.obj.firstItemType;
          }
          if (tmpArr.indexOf(item.distId) === -1) {
            // 地区数据
            this.areaList.push({
              distId: item.distId,
              distName: item.distName
            });
            tmpArr.push(item.distId);
          }
        });
        if (this.baseParams.isHjia) {
          this.selectedStoreId = res.obj.storeIdCurrent;
        }
        // 传递了storeId
        let arr = [];
        this.originData.forEach((item, index) => {
          if (item.storeId * 1 === this.selectedStoreId * 1) {
            arr.push(item);
            return false;
          }
        });
        if (arr.length > 0) {
          this.areaList.forEach((item, index) => {
            if (arr[0].distId === item.distId) {
              //this.subSelectedIndex = index;
              return false;
            }
          });
        }
        this.storeList = this.originData.slice();
      },(err) => {
        // 提示错误
        this.toast('/store/mylist/1.htm请求错误');
      });
    },
    methods: {
      checkParams(flag = false, ...args) {
        var returnFlag = true;
        args.every((item, index) => {
          let val = flag ? this.baseParams[item] : this.params[item];
          if (!val) {
            returnFlag = false;
            this.log(item + ' is undefined');
            this.toast(`${item} is undefined`);
            return false;
          } else {
            return true;
          }
        });
        return returnFlag;
      },
      tabFn(index) {
        // tab 选择
        let flag = this.selectedIndex === index;
        if (flag) {
          this.selectedIndex = null;
          this.disabledScroll('auto');
        } else {
          this.selectedIndex = index;
          this.disabledScroll('hidden');
        }
      },
      tabContentFn(item, index) {
        // tabContent 具体区选择
        this.selectedIndex = null;
        this.subSelectedIndex = index;
        this.log(`选择了哪个区域:${this.areaList[this.subSelectedIndex].distName},区域id: ${this.areaList[this.subSelectedIndex].distId},domain: ${this.baseParams.domain}`);
        if (!this.subSelectedIndex) {
          // 全部区域
          this.storeList = this.originData.slice();
        } else {
          this.setStoreList(item.distId);
        }
        this.disabledScroll('auto');
      },
      setStoreList(distId) {
        let arr = [];
        this.originData.forEach((item, index) => {
          if (distId === item.distId) {
            arr.push(item);
          }
        });
        this.storeList = arr;
      },
      closeMask() {
        // 关闭mask
        this.selectedIndex = null;
        this.disabledScroll('auto');
      },
      disabledScroll(val) {
        let htmlEle = document.getElementsByTagName('html')[0];
        let bodyEle = document.getElementsByTagName('body')[0];
        if (val === 'auto') {
          htmlEle.style.overflow = 'auto';
          htmlEle.style.height = 'auto';
          bodyEle.style.overflow = 'auto';
          bodyEle.style.height = 'auto';
        } else {
          htmlEle.style.overflow = 'hidden';
          htmlEle.style.height = '100%';
          bodyEle.style.overflow = 'hidden';
          bodyEle.style.height = '100%';
        }
      },
      selectStore(item, index, subIndex) {
        // 点击选择门店
        let forwardUrl = this.baseParams.forwardUrl;
        this.selectedStoreId = item.storeId * 1;
        this.log(`storeId:${item.storeId},storeCode:${item.storeNo}`);

        let url = null;
        if (this.baseParams.isHjia) {
          forwardUrl = encodeURIComponent(forwardUrl);
          window.location.replace(`/store/setStore.htm?storeId=${this.selectedStoreId}&forwardUrl=${forwardUrl}`);
        } else if (!this.baseParams.isHjia) {
          let hashIndex = forwardUrl.indexOf('#');
          let hashUrl = forwardUrl.substr(hashIndex);
          if (/\?/g.test(hashUrl)) {
            url = `${forwardUrl}&storeId=${this.selectedStoreId}`;
          } else {
            url = `${forwardUrl}?storeId=${this.selectedStoreId}`;
          }
          window.location.replace(url);
        }
      },
      resetUrl(key, val) {
        let reg = new RegExp('(' + key + '=).*?(&|$)');
        let url = this.baseParams.forwardUrl.replace(reg, '$1' + val + '$2');
        return url;
      },
      toast(msg) {
        this.$Toast({
          content: msg,
          toastw: '80%'
        });
      },
      log(msg) {
        if (this.isDebug) {
          console.log(msg);
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../assets/scss/common";
  $gray2: #E8E8E8;
  body {
    background: #f5f5f5;
  }
  .store {
    .display-none {
      display: none;
    }
    .header {
      position: fixed;
      z-index: 100;
      width: 100%;
      height: rem(40);
      border-bottom: 1px solid $gray2;
      background: $white;
      color: $gray-light;
      font-size: rem(15);
      line-height: rem(40);
      img {
        height: rem(19);
        vertical-align: middle;
      }
      img:nth-of-type(1) {
        display: inline-block;
      }
      img:nth-of-type(2),img:nth-of-type(3) {
        display: none;
      }
      &.contentSelected {
        color: $blue;
        img:nth-of-type(1), img:nth-of-type(2) {
          display: none
        }
        img:nth-of-type(3) {
          display: inline-block;
        }
      }
      &.selected {
        img:nth-of-type(1), img:nth-of-type(3) {
          display: none
        }
        img:nth-of-type(2) {
          display: inline-block;
        }
      }
    }
    .area-select-wrapper {
      overflow-y: scroll;
      position: fixed;
      top: rem(41);
      left: 0;
      z-index: 101;
      display: none;
      width: 100%;
      max-height: 50%;
      &.active {
        display: block;
      }
      li {
        height: rem(48);
        border-bottom: 1px solid $gray2;
        background: $white;
        color: $dark;
        font-size: rem(15);
        text-align: center;
        line-height: rem(48);
        &.active {
          color: $blue;
        }
      }
    }
    .store-wrapper {
      padding: rem(40) rem(13) 0 rem(15);
      background: $white;
      .store-item {
        align-items: stretch;
        padding: rem(12) 0 rem(14) 0;
        border-bottom: 1px solid $gray2;
        &:last-of-type {
          border-bottom: 0;
        }
        &.active {
          .right-icon {
            opacity: 1;
          }
        }
        > dl {
          overflow: hidden;
          -webkit-box-flex: 3;
          -webkit-flex: 3 0 0;
          -ms-flex: 3 0 0px;
          flex: 3 0 0;
          dt {
            position: relative;
            display: inline-block;
            width: auto;
            padding-right: 34px;
            color: #383838;
            font-size: rem(17);
            i {
              position: absolute;
              right: 0;
              top: 4px;
              display: inline-block;
              padding: 1px 2px;
              border: 0.5px solid $blue;
              color: $blue;
              font-size: rem(11);
              line-height: 11px;
            }
          }
          dd {
            padding-top: rem(8);
            color: $gray-dark;
            font-size: rem(13);
          }
        }
        > span {
          -webkit-box-flex: 1;
          -webkit-flex: 1 0 0;
          -ms-flex: 1 0 0px;
          flex: 1 0 0;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: end;
          -webkit-justify-content: flex-end;
          -ms-flex-pack: end;
          justify-content: flex-end;
          -webkit-box-align: end;
          -webkit-align-items: flex-end;
          -ms-flex-align: end;
          align-items: flex-end;
          color: $gray-dark;
          font-size: rem(13);
        }
        > .right-icon {
          -webkit-box-flex: 1;
          -webkit-flex: 1 0 0;
          -ms-flex: 1 0 0px;
          flex: 1 0 0;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: end;
          -webkit-justify-content: flex-end;
          -ms-flex-pack: end;
          justify-content: flex-end;
          -webkit-box-align: center;
          -webkit-align-items: center;
          -ms-flex-align: center;
          align-items: center;
          opacity: 0;
          img {
            width: rem(20);
          }
        }
      }
    }
    .mask {
      display: none;
      &.active {
        display: block;
      }
    }
  }
</style>
