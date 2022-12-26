<template>
  <div class="page-order-add">
    <div class="v1-main">
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <div class="mobile">
        <m-header :title="'订单详情'" />
      </div>

      <div class="order-info" v-if="!loading && buyList.length > 0">
        <h1 class="pc-wrap">
          订单信息
          <span>{{ orderNo }}</span>
        </h1>
        <!-- pc商品信息-start -->
        <div class="pc-wrap">
          <div class="goods-info" v-for="(item, index) in buyList" :key="index">
            <!--    <div
              class="cover video-cover"
              v-if="item.goods.commodity.typeFile == 3"
              @click="onPlayVideo(item.goods)"
            >
              <div class="icon icon-play"></div>
              <img v-lazy="item.goods.commodity.cover" />
            </div>
            <div class="cover" @click="showBigPic('cover' + item.goods.id)" v-else>
              <img
                :id="`cover${item.goods.id}`"
                :src="item.goods.commodity.cover"
                :large="item.goods.commodity.cover"
                preview="1"
              />
            </div> -->
            <div class="img-wrap">
              <goods-frame
                :goods-info="item.goods"
                :index="index"
                :isShowPreview="true"
                :isShowLike="false"
                :isShowGoodsName="false"
                :isShowNumber="false"
                :isShowPrepaySign="isPrepay"
                @listenCoverClick="listenCoverClick"
              >
                <span slot="footer"></span>
              </goods-frame>
            </div>

            <div class="info">
              <div class="line line-10">
                <h1>商品名称</h1>

                <p class="num-wrap">
                  {{ item.goods.commodity.name }}
                  <commodity-num
                    class="ui-commodity-num"
                    :treasure="item.goods"
                  ></commodity-num>
                </p>

                <h2 v-if="fromPage != 'order'">
                  {{ $common.formatMoney(item.goods.price) }}
                </h2>
              </div>

              <div class="line line-10">
                <h1>艺术家</h1>
                <p v-if="item.goods.author">
                  <i
                    :style="`
                      background: url('${
                        item.goods.author.cover
                          ? item.goods.author.cover
                          : 'https://source.theone.art/watermarkResize/8c6269d60edafe3a31785fa7bdf31563/4346296d6f2c3b4b3c4daa0d5abc23ca-16362781979580.9.jpg'
                      }') no-repeat left;background-size: cover;
                    `"
                  ></i>
                  {{ item.goods.author.nickname }}
                </p>
                <h3>
                  <div v-if="orderNo">X {{ item.amount }}</div>

                  <el-input-number
                    v-else
                    :disabled="elNumberDisabled"
                    v-model="item.amount"
                    @change="(n1, n2) => handleChange(n1, n2, item)"
                    :min="1"
                    :max="50"
                    label="数量"
                  ></el-input-number>

                  <!--     <div v-else>X 1</div> -->
                </h3>
              </div>
              <!--          <div
                class="line"
                v-if="item.goods.seriesWorks && item.goods.seriesWorks.name"
              >
                <h1>系列</h1>
                <p>
                  {{
                  item.goods.seriesWorks
                  ? item.goods.seriesWorks.name
                  : "无系列"
                  }}
                </p>
              </div>-->
              <div
                class="line"
                v-if="item.goods.publisher && item.goods.publisher.type == 2"
              >
                <h1>出售方</h1>
                <p>{{ item.goods.publisher.nickname }}的店铺</p>
              </div>
              <div class="line">
                <h1 class="m-title">合约地址</h1>
                <p>
                  <copy
                    v-if="$authInfomation.contractAddress(item.goods)"
                    class="m-copy-blue"
                    @listen="
                      $authInfomation.goContractAddress(
                        $authInfomation.getChainName(item.goods),
                        $authInfomation.contractAddress(item.goods),
                        $authInfomation.getChainContract(item.goods)
                      )
                    "
                    :is-full="false"
                    :short="6"
                    :txt="$authInfomation.contractAddress(item.goods)"
                  />
                  <span v-else>上链确认中</span>
                </p>
              </div>
              <div class="line">
                <h1>认证标识</h1>
                <p>
                  <copy
                    v-if="$authInfomation.getNftId(item.goods)"
                    class="m-copy-blue"
                    @listen="
                      $authInfomation.goNftId(
                        $authInfomation.getChainName(item.goods),
                        $authInfomation.contractAddress(item.goods),
                        $authInfomation.getNftId(item.goods),
                        $authInfomation.getChainContract(item.goods)
                      )
                    "
                    :short="6"
                    :is-full="false"
                    :txt="$authInfomation.getNftId(item.goods)"
                  />
                  <span v-else>上链确认中</span>
                </p>
              </div>

              <!-- <div
                class="line"
                v-if="
                  item.goods.seriesWorks &&
                  item.goods.seriesWorks.type == 1 &&
                  item.goods.seriesWorks.name
                "
              >
                <h1>系列</h1>

                <p>{{ item.goods.seriesWorks.name }}</p>
              </div> -->
            </div>
          </div>
        </div>

        <!-- pc商品信息-end -->
        <!-- m商品信息-start -->
        <div class="mobile">
          <div
            class="mobile-goods-info"
            v-for="(item, index) in buyList"
            :key="index"
          >
            <div
              class="cover video-cover"
              v-if="item.goods.commodity.typeFile == 3"
              @click="onPlayVideo(item.goods)"
            >
              <div class="icon icon-play"></div>
              <img v-lazy="item.goods.commodity.cover" />
            </div>
            <!--      <div
              class="cover"
              @click="showBigPic('cover' + item.goods.id)"
              v-else
            >
              <img
                :id="`cover${item.goods.id}`"
                :src="item.goods.commodity.cover"
                :large="item.goods.commodity.cover"
                preview="1"
              />
            </div> -->
            <div class="img-wrap">
              <goods-frame
                :goods-info="item.goods"
                :index="index"
                :isShowPreview="true"
                :isShowLike="false"
                :isShowGoodsName="false"
                :isShowNumber="false"
                :isShowPrepaySign="isPrepay"
                @listenCoverClick="listenCoverClick"
              >
                <span slot="footer"></span>
              </goods-frame>
            </div>
            <div class="line-bar">
              <div class="title">{{ item.goods.commodity.name }}</div>
              <div>
                <commodity-num
                  class="ui-commodity-num"
                  :treasure="item.goods"
                ></commodity-num>
              </div>
            </div>
            <div class="line-bar">
              <div class="key">数量</div>
              <div>
                <div v-if="orderNo">X {{ item.amount }}</div>

                <el-input-number
                  v-else
                  v-model="item.amount"
                  :disabled="elNumberDisabled"
                  @change="(n1, n2) => handleChange(n1, n2, item)"
                  :min="1"
                  :max="50"
                  label="数量"
                ></el-input-number>
              </div>
            </div>
            <div class="line-bar">
              <div class="key">艺术家</div>
              <div class="val">
                <i
                  class="face-icon"
                  :style="`
                      background: url('${
                        item.goods.author && item.goods.author.cover
                          ? item.goods.author.cover
                          : 'https://source.theone.art/watermarkResize/8c6269d60edafe3a31785fa7bdf31563/4346296d6f2c3b4b3c4daa0d5abc23ca-16362781979580.9.jpg'
                      }') no-repeat left;background-size: cover;
                    `"
                ></i>
                {{ item.goods.author && item.goods.author.nickname }}
              </div>
            </div>
            <!-- <div
              class="line-bar"
              v-if="item.goods.seriesWorks && item.goods.seriesWorks.name"
            >
              <div class="key">系列</div>
              <div class="val">
                {{
                item.goods.seriesWorks
                ? item.goods.seriesWorks.name
                : "无系列"
                }}
              </div>
            </div> -->
            <div
              class="line-bar"
              v-if="item.goods.publisher && item.goods.publisher.type == 2"
            >
              <div class="key">出售方</div>
              <div class="val">{{ item.goods.publisher.nickname }}的店铺</div>
            </div>
            <div class="line-bar" style="align-items: flex-start">
              <div class="key m-title">合约地址</div>
              <div class="val">
                <copy
                  v-if="$authInfomation.contractAddress(item.goods)"
                  class="m-copy-blue"
                  @listen="
                    $authInfomation.goContractAddress(
                      $authInfomation.getChainName(item.goods),
                      $authInfomation.contractAddress(item.goods)
                    )
                  "
                  :is-full="false"
                  :short="6"
                  :txt="$authInfomation.contractAddress(item.goods)"
                />
                <div v-else>上链确认中</div>
              </div>
            </div>
            <div class="line-bar" style="align-items: flex-start">
              <div class="key m-title">认证标识</div>
              <div class="val">
                <copy
                  class="m-copy-blue"
                  v-if="$authInfomation.getNftId(item.goods)"
                  @listen="
                    $authInfomation.goNftId(
                      $authInfomation.getChainName(item.goods),
                      $authInfomation.contractAddress(item.goods),
                      $authInfomation.getNftId(item.goods)
                    )
                  "
                  :short="6"
                  :is-full="false"
                  :txt="$authInfomation.getNftId(item.goods)"
                />
                <div v-else>上链确认中</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 加购实体画作 -->
        <div class="add-paintings-wrap" v-if="activeInfo.statusAvailable == 1">
          <div class="content hand" @click="toggleAddPaintings">
            <span
              class="ui-icon icon-select icon-radius"
              :class="{ 'icon-selected': isPaintings }"
            ></span>
            <span class="ui-icon icon-gift"></span>
            <div class="txt">加购实体画作</div>
          </div>
          <div class="price">
            {{ $common.formatMoney(activeInfo.appendPrice) }}
          </div>
        </div>
        <!-- 待支付加购实体画作，不可点击 -->
        <div
          class="add-paintings-wrap"
          v-else-if="
            orderResult &&
            orderResult.postInfo &&
            orderResult.postInfo.onlineType == 3 &&
            orderResult.appendPrice
          "
        >
          <div class="content">
            <span class="ui-icon icon-select icon-radius icon-selected"></span>
            <span class="ui-icon icon-gift"></span>
            <div class="txt">加购实体画作</div>
          </div>
          <div class="price">
            {{ $common.formatMoney(orderResult.appendPrice) }}
          </div>
        </div>
        <div class="order-money">
          <div class="pay-wrap">
            <p>支付方式</p>
            <div class="pay-way">
              <div class="pay-way-list">
                <div
                  :class="[
                    'pay-way-item',
                    item.disable ? 'pay-way-disabled' : '',
                    payWayIdx == index ? 'pay-way-active' : '',
                  ]"
                  v-for="(item, index) in payWayList"
                  :key="index"
                  @click="setSelectItem(index, item)"
                >
                  {{ item.name }}
                  <img
                    class="warning-img"
                    src="https://static.theone.art/pc/images/icon-balance.png"
                    alt
                  />
                  <div class="pay-balance-pop">{{ item.desc }}</div>
                </div>
              </div>
            </div>
          </div>
          <template v-if="isPaintings">
            <!-- //pc下单页 -->
            <div
              class="order-money delivery-pc"
              v-if="
                (!goodsDetail.online && fromPage != 'order') || isShowPostWay
              "
            >
              <div class="pay-wrap">
                <p>配送方式</p>
                <div class="pay-way">
                  <div class="pay-way-list">
                    <div
                      :class="[
                        'pay-way-item',
                        deliveryType.key == item.key ? 'pay-way-active' : '',
                      ]"
                      v-for="(item, index) in deliveryList"
                      :key="index"
                      @click="setDelivery(item)"
                    >
                      {{ item.val }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- //pc待支付页 -->
            <div
              class="order-money delivery-pc"
              v-if="
                orderResult &&
                orderResult.postInfo &&
                fromPage == 'order' &&
                !(
                  orderResult.postInfo.onlineType == 3 &&
                  !orderResult.postInfo.sendType
                )
              "
            >
              <div class="pay-wrap">
                <p>配送方式</p>
                <div class="pay-way">
                  <div class="pay-way-list">
                    <div class="pay-way-item pay-way-active">
                      {{ deliveryType.val }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- //h5下单页 -->
            <div
              class="delivery-warp"
              v-if="!goodsDetail.online && fromPage != 'order'"
            >
              <div class="delivery-type">
                <div class="label">配送方式：</div>
                <div class="down" @click="isShowDelivery = true">
                  {{ deliveryType.val }}
                </div>
              </div>
              <van-popup round v-model="isShowDelivery" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="deliveryList"
                  value-key="val"
                  @confirm="setDelivery"
                  @cancel="isShowDelivery = false"
                ></van-picker>
              </van-popup>
              <div
                class="delivery-address"
                v-if="deliveryType.key == 2 || deliveryType.key == 3"
              >
                <div class="address-text">
                  {{ addressDefault.province }} {{ addressDefault.city }}
                  {{ addressDefault.area }} {{ addressDefault.addressDetail }}
                </div>
                <div class="address-user">
                  <div class="label">
                    {{ addressDefault.contactsName }}
                    {{ addressDefault.contactsPhone }}
                  </div>
                  <div class="go-btn" @click="goAddress()">更换</div>
                </div>
              </div>
            </div>
            <!-- //h5待支付页 -->
            <div
              class="delivery-warp"
              v-if="
                orderResult &&
                orderResult.postInfo &&
                fromPage == 'order' &&
                !(
                  orderResult.postInfo.onlineType == 3 &&
                  !orderResult.postInfo.sendType
                )
              "
            >
              <div class="delivery-type">
                <div class="label">配送方式：</div>
                <div class="down down-pay">{{ deliveryType.val }}</div>
              </div>
              <div
                class="delivery-address"
                v-if="deliveryType.key == 2 || deliveryType.key == 3"
              >
                <div class="address-text">
                  {{ orderResult.postInfo.address }}
                </div>
                <div class="address-user">
                  <div class="label">
                    {{ orderResult.postInfo.name }}
                    {{ orderResult.postInfo.phone }}
                  </div>
                </div>
              </div>
            </div>
            <!-- //pc下单页邮寄地址展示 -->
            <div
              class="address-pc"
              v-if="
                (deliveryType.key == 2 || deliveryType.key == 3) &&
                addressList.length > 0
              "
            >
              <div class="label">
                收货地址<span @click="onSetting()">添加收货地址</span>
              </div>
              <div
                :class="[
                  'address-ul',
                  onPcAddress && addressList.length > 1
                    ? 'address-ul-active'
                    : '',
                ]"
              >
                <div v-for="(item, index) in addressList" :key="index">
                  <div class="address-ul-li" v-if="item.isCheck || onPcAddress">
                    <div
                      :class="['radio', item.isCheck ? 'radio-active' : '']"
                      @click="setAddress(item)"
                    ></div>
                    <div class="text">
                      {{ item.contactsName }} {{ item.contactsPhone }}
                      {{ item.province }} {{ item.city }} {{ item.area }}
                      {{ item.addressDetail }}
                    </div>
                    <div class="is-default" v-if="item.isDefault">默认</div>
                    <div class="tr-btn" v-if="!active_id">
                      <span v-if="!item.isDefault" @click="setDefault(item)"
                        >设为默认</span
                      >
                      <span @click="onSetting(item)">编辑</span>
                      <span @click="delAddress(item)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="on-off open-address"
                v-if="!onPcAddress && addressList.length > 1"
                @click="onPcAddress = true"
              >
                展开地址
              </div>
              <div
                class="on-off close-address"
                v-if="onPcAddress && addressList.length > 1"
                @click="onPcAddress = false"
              >
                收起地址
              </div>
            </div>
            <!-- //pc待支付页邮寄地址展示 -->
            <div
              class="address-pc"
              style="margin-bottom: 20px"
              v-if="
                (deliveryType.key == 2 || deliveryType.key == 3) &&
                orderResult &&
                orderResult.postInfo &&
                fromPage == 'order'
              "
            >
              <div class="label">收货地址</div>
              <div class="address-ul">
                <div>
                  <div class="address-ul-li">
                    <div class="radio radio-active"></div>
                    <div class="text">
                      {{ orderResult.postInfo.name }}
                      {{ orderResult.postInfo.phone }}
                      {{ orderResult.postInfo.address }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div
            class="line"
            v-if="
              orderInfo.priceWallet &&
              payWayList[payWayIdx] &&
              (payWayList[payWayIdx].payChannel == 'balance' || isBalancePop)
            "
          >
            <h1 v-if="isBalance">可用余额：</h1>
            <h1 v-if="!isBalance">可用余额不足：</h1>
            <p>{{ $common.formatMoney(orderInfo.priceWallet) }}</p>
          </div>
          <div class="line">
            <h1>
              <span>{{ orderInfo.amount }}</span
              >件商品，总商品金额：
            </h1>
            <p
              class="warning-color"
              :class="{
                'through-line': isDiscount,
              }"
            >
              {{ $common.formatMoney(orderInfo.price) }}
            </p>
          </div>
          <div class="line" v-if="deliveryType.key == 3 && isPaintings">
            <h1>运费：</h1>
            <p class="warning-color">
              {{
                $common.formatMoney(
                  activeInfo.postPrice || orderResult.postPrice
                )
              }}
            </p>
          </div>

          <div v-if="isDiscount">
            <div class="line">
              <h1>
                使用【<span class="discount-names hidden-1">{{
                  discountNames
                }}</span
                >】：
              </h1>
              <p class="warning-color">
                -{{ $common.formatMoney(discountMoney) }}
              </p>
            </div>
          </div>
          <div class="line" v-if="isShowRealPayMoeny">
            <h1>实付总商品金额：</h1>
            <p class="warning-color">
              {{ $common.formatMoney(realPriceAmount) }}
            </p>
          </div>
          <!-- 定金 -->
          <div v-if="fromPage == 'goods' && this.isPrepay">
            <div class="line" :class="{ 'prepay-active': isDeposit }">
              <h1>定金：</h1>
              <p class="warning-color">
                {{
                  $common.formatMoney(
                    (discountAmountInfo.presaleInfo &&
                      discountAmountInfo.presaleInfo.depositAmount) ||
                      (goodsDetail.presaleInfo &&
                        goodsDetail.presaleInfo.depositAmount)
                  )
                }}
                {{ isPayment ? "(已支付)" : "(待付款)" }}
              </p>
            </div>
          </div>
          <!-- 尾款 -->
          <div v-if="fromPage == 'order' && this.isPrepay">
            <div class="line" :class="{ 'prepay-active': isDeposit }">
              <h1>定金：</h1>

              <p class="warning-color">
                {{
                  $common.formatMoney(
                    depositObj && depositObj.presaleAmountExt.depositAmount
                  )
                }}
                <span v-if="depositObj.statusPay == 0"> (待支付)</span>
                <span v-if="depositObj.statusPay == 1"> (已支付)</span>
              </p>
            </div>

            <div
              class="line"
              :class="{ 'prepay-active': isPayment }"
              v-if="isPayment"
            >
              <h1>尾款：</h1>
              <p class="warning-color">
                {{
                  $common.formatMoney(
                    balanceObj && balanceObj.presaleAmountExt.balanceAmount
                  )
                }}
                <span v-if="balanceObj.statusPay == 0"> (待支付)</span>
                <span v-if="balanceObj.statusPay == 1"> (已支付)</span>
              </p>
            </div>
          </div>
          <div
            class="big-bank-tip"
            v-if="
              payWayList[payWayIdx] &&
              payWayList[payWayIdx].payChannel == 'baofoo' &&
              payWayList[payWayIdx].payType == 4
            "
          >
            <span @click="showBigBanks" class="blue pointer"
              >查看支持的银行卡和额度</span
            >
          </div>
          <!--   宝户协议支付 -->
          <div
            class="line"
            v-if="
              payWayList[payWayIdx] &&
              payWayList[payWayIdx].payChannel == 'baofoo' &&
              payWayList[payWayIdx].payType == 3
            "
          >
            <div v-if="baohuInfo.status == 2">
              <span class="blue pointer" @click="showBanks"
                >查看支持的银行卡和额度</span
              >
              当前银行卡：
              <span
                style="color: #666666"
                v-if="baohuInfo.bankAccount && baohuInfo.statusBankCard == 1"
              >
                {{ baohuInfo.bankAccount }}
                <span class="blue pointer" @click="onChangeBanck">更换</span>
              </span>
              <span v-else class="blue pointer" @click="goBindBank"
                >去绑定银行卡</span
              >
            </div>

            <div v-else class="blue">
              <span @click="goBindBank" class="pointer"
                >您尚未开通此支付通道，去开通</span
              >
            </div>
          </div>
          <!--  易宝支付 -->
          <!--           <div
            class="line"
            v-if="
              payWayList[payWayIdx] && payWayList[payWayIdx].payChannel == 'yb'
            "
          >
            <div v-if="ybInfo.status == 1 && ybInfo.statusBankCard == 1">
       
              当前银行卡：
              <span
                style="color: #666666"
                v-if="ybInfo.bankAccount && ybInfo.statusBankCard == 1"
                >{{ ybInfo.bankAccount
                }}<span class="blue pointer" @click="onChangeYbBanck">
                  更换</span
                ></span
              >
              <span v-else class="blue pointer" @click="goBindBank"
                >去绑定银行卡</span
              >
            </div>
          </div>-->
        </div>

        <!--  汇元支付 -->
        <!--       <div
          class="m-pay-tip"
          v-if="
            payWayList[payWayIdx] && payWayList[payWayIdx].payChannel == 'hy'
          "
        >
          <div class="blue" v-if="hyInfo.statusBankCard !== 1">
            <span @click="goHyBindBank" class="pointer">
              您尚未绑定银行卡，去绑定</span
            >
          </div>
        </div>-->
        <!--  余额支付 -->
        <div
          class="m-pay-tip"
          v-if="
            payWayList[payWayIdx] &&
            payWayList[payWayIdx].payChannel == 'balance'
          "
        >
          <div class="blue" v-if="!isBalance">余额不足</div>
        </div>
        <div v-if="isPrepay">
          <section class="prepay-agreement-wrap" v-if="isDeposit">
            <div
              class="agreement-content hand"
              @click="isPrepayAgreement = !isPrepayAgreement"
            >
              <span
                class="ui-icon hand"
                :class="
                  isPrepayAgreement
                    ? 'icon-agreement-radius-checked'
                    : 'icon-agreement-radius'
                "
              /><span class="hand">我同意</span>
              <span class="link hand" @click.stop="goNews('sale_deposit_rules')"
                >《数字艺术品售卖定金担保规则》</span
              ><span>,知晓未付尾款定金不退</span>
            </div>
          </section>

          <section class="warning-text" v-if="isPayment">
            尾款支付时间：{{ balanceObj.limitStartTime }}-{{
              balanceObj.limitEndTime
            }}
          </section>
        </div>

        <div class="order-btn">
          <div class="v1-btn normal moblie-return" @click="goBack">
            {{ fromPage == "goods" ? "返回详情" : "返回" }}
          </div>

          <div
            :class="{
              'v1-btn': true,
              disable: payBtnDisabled,
            }"
            @click="onSubmitOrder"
            v-loading.fullscreen.lock="flag.submitBtn"
          >
            {{ payBtnTxt }}
          </div>
        </div>
        <div class="order-message"></div>

        <div class="order-update" v-if="goodsDetail.showStatus == 4">
          <div class="v1-btn-link blue" @click="onReload">刷新</div>
          <p>当前有人下单，请稍后在试</p>
        </div>
      </div>
    </div>

    <!-- 订单超额提醒 -->
    <amountOverrun ref="amountOverrun"></amountOverrun>
    <!-- 实名认证 -->
    <nameVerified
      ref="nameVerified"
      @listen="listenNameVerified"
    ></nameVerified>
    <!-- 设置支付密码 -->
    <setPayPassword
      ref="setPayPassword"
      @listen="listenSetPayPassword"
    ></setPayPassword>
    <!-- 输入支付密码 -->
    <inPayPassword
      ref="inPayPassword"
      @listen="listenInPayPassword"
    ></inPayPassword>
    <payCode ref="PayCode" :payWay="payWayList[payWayIdx]" />
    <!-- 微信浏览器支付弹窗 -->
    <wxPayPop ref="wxPayPop" />
    <!-- 大额支付弹窗 -->
    <buy-big-pay ref="BigPayRef" :payInfo="payWayList[payWayIdx]"></buy-big-pay>
    <buy-cards ref="BHCardsRef" location="BAOFOO_PAY_BANK_LIST"></buy-cards>
    <!--  手机端大额支付提示 -->
    <el-dialog
      title="网银支付"
      :visible.sync="isShowBigPayTip"
      :before-close="() => (isShowBigPayTip = false)"
    >
      <div class="m-success-wrap">
        <div class="txt">请移步至PC端进行支付</div>

        <div class="btn-group btn-center">
          <div class="btn btn-large btn-red" @click="isShowBigPayTip = false">
            我知道了
          </div>
        </div>
      </div>
    </el-dialog>
    <yb-pay></yb-pay>
    <!-- 汇元支付绑卡 -->
    <hy-pay
      ref="HyPay"
      :money="orderInfo.price"
      :showAddBank="goHyBindBank"
      :hyInfo="hyInfo"
      :payWay="payWayList[payWayIdx]"
    />
    <hy-bind-card
      ref="HyBindCardRef"
      :payWay="payWayList[payWayIdx]"
      :listenSuccess="hyBindCardSuccess"
      :hyInfo="hyInfo"
    />

    <hy-pay-code
      ref="HyPayCodeRef"
      :bankInfo="currentBankInfo"
      :payWay="payWayList[payWayIdx]"
    />
    <bh-bind-card
      ref="bhBindCardRef"
      class="bh-bind-card-wrap"
      :submit="bindcardChange"
    ></bh-bind-card>
    <bh-select-cards
      :bankList="userBankCardList"
      v-if="isShowSelectCard"
      class="selecte-cards-wrap ui-section"
    ></bh-select-cards>
    <yb-bind-card
      ref="YbBindCardRef"
      :payWay="payWayList[payWayIdx]"
      @listenSuccess="ybBindCardSuccess"
      :accountInfo="ybInfo"
    ></yb-bind-card>
    <el-dialog
      title="验证成功"
      :visible.sync="isShowSetPassword"
      width="460px"
      :before-close="() => (isShowSetPassword = false)"
    >
      <div class="m-success-wrap text-left">
        <div class="txt">
          就差一步就验证完成啦，此支付密码是您在宝付账户专项提现时使用，请牢记。
        </div>
        <div class="btn-group btn-right">
          <div class="btn btn-red" @click="onSetPassword">
            去宝付账户设置支付密码
          </div>
        </div>
      </div>
    </el-dialog>
    <bh-small-bank ref="BHSmallCardsRef"></bh-small-bank>
    <el-dialog
      class="v1-dialog-mycenter"
      :visible.sync="isShowConsignment"
      append-to-body
      width="90%"
      :before-close="onCancelC"
      title="邮寄风险提示"
      :showClose="!active_id"
    >
      <div class="content consignment-content">
        <div class="c-html" v-html="consignmentHtml"></div>
        <div class="btn-group">
          <div class="btn btn-default" v-if="!active_id" @click="onCancelC">
            暂不使用
          </div>

          <div class="btn btn-red" v-if="isDownOver" @click="onIAgree()">
            我同意
          </div>
          <div class="btn btn-default" v-else>
            {{ btnTxt }}
          </div>
        </div>
      </div>
    </el-dialog>
    <editor-address ref="editorAddress"></editor-address>
  </div>
</template>

<script>
import loading from "@/components/v1/loading/loading";
import nameVerified from "@/pages/v1/mine/setting/nameVerified";
import setPayPassword from "@/pages/v1/mine/setting/setPayPassword";
import inPayPassword from "@/pages/v1/mine/setting/inPayPassword";
import BigNumber from "bignumber.js";
import mHeader from "@/components/v1/layout/mobileHeader";
import payCode from "./payCode.vue";
import amountOverrun from "./amountOverrun.vue";
import wxPayPop from "../goods/components/wxPayPop";
import BuyBigPay from "./components/buy-big-pay.vue";
import BuyCards from "./components/buy-cards.vue";
import countDown from "@/utils/countDown";
import createForm from "@/utils/form";
import Encryption from "@/utils/encryption";
import YbPay from "./components/yb-pay.vue";
import HyBindCard from "./components/hy-bind-card.vue";
import BhBindCard from "@/components/v1/baohu/bind-card.vue";
import BhSelectCards from "@/components/v1/baohu/select-cards.vue";
import BhSmallBank from "./components/bh-small-bank.vue";
import HyPay from "./components/hy-pay.vue";
import HyPayCode from "./components/hy-pay-code.vue";
// import uiSelect from "@/components/v1/ui-select.vue";
import YbBindCard from "./components/yb-bind-card.vue";
/* const BigInteger = require("@/utils/jsbn").BigInteger;
import axios from "axios"; */
import EditorAddress from "@/pages/v1/mine/setting/address-manage/components/editor-address.vue";

export default {
  components: {
    loading,
    nameVerified,
    setPayPassword,
    inPayPassword,
    mHeader,
    payCode,
    amountOverrun,
    wxPayPop,
    BuyBigPay,
    BuyCards,
    YbPay,
    BhBindCard,
    BhSelectCards,
    BhSmallBank,
    HyBindCard,
    HyPay,
    HyPayCode,
    // uiSelect,
    YbBindCard,
    EditorAddress,
  },
  data() {
    return {
      ybAccountObj: {}, //易宝信息
      orderDetail: {}, //订单详情
      activeInfo: {},
      isShowPostWay: false,
      isPaintings: true,
      elNumberDisabled: false,
      isPrepayAgreement: false,
      discountAmountInfo: {
        discountInfo: {},
        soldDiscountInfo: {},
      },
      currentBankInfo: {},
      isBalance: false, //是否可以使用余额支付
      isBalancePop: false, //余额不足弹窗
      hyInfo: {
        statusBankCard: false,
      },
      ybInfo: {},
      goodsDetail: {}, //单个商品
      isShowSelectCard: false,
      userBankCardList: [],
      payWayList: [],
      payWayIdx: 0,
      isShowSetPassword: false,
      loading: true,
      buyDisabled: false,
      isShowBigPayTip: false,
      orderInfo: {}, //订单相关信息
      buyList: [], //购买商品列表数据

      orderAddParam: {
        goodsList: [],
        payType: 2, //1微信   2支付宝
        payMode: 1, //1、PC 2、PHONE
        unitType: 3,
      },
      payTime: false,
      fromPage: "goods", //页面来源  goods商品详情  order个人中心订单
      /*       userAttr: null, //用户属性 */
      payPassword: "", //支付密码
      orderNo: null, //订单号
      isConfig: false,
      orderTime: {
        configTime: 0, //订单有效期 以秒为单位
        remainTime: null,
        timer: null,
      },
      flag: {
        submitBtn: false,
      },
      show: true,
      baohuInfo: {},
      deliveryType: { key: 1, val: "自提" },
      deliveryList: [
        { key: 1, val: "自提" },
        { key: 2, val: "邮寄到付" },
        { key: 3, val: "邮寄现付" },
      ],
      isShowDelivery: false,
      addressDefault: {},
      addressList: [],
      isShowConsignment: false,
      isAgreecConsignment: false,
      btnTxt: "",
      isDownOver: false,
      consignmentHtml: "",
      onPcAddress: false,
      selectLabel: null, //指定label字段
      discountParams: {
        saleRecordAmount: 1,
        saleRecordUuid: "",
      },
    };
  },
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
  },
  computed: {
    payBtnTxt() {
      if (this.isPayment) {
        return "支付尾款";
      }
      if (this.isDeposit) {
        return "支付定金";
      }
      return "立即支付";
    },
    isDeposit() {
      //是否定金支付
      //从市场进来&2

      if (this.fromPage == "goods" && this.isPrepay) {
        return true;
      } else {
        if (this.fromPage == "order" && this.depositObj.statusTrade == 0) {
          return true;
        }
      }
      return false;
    },
    isPayment() {
      //是否支付尾款

      if (
        this.fromPage == "order" &&
        this.isPrepay &&
        this.balanceObj.statusTrade == 0
      ) {
        return true;
      }
      return false;
    },
    depositObj() {
      //定金信息
      if (
        this.fromPage == "order" &&
        this.orderDetail.tags &&
        this.orderDetail.tags.search(/presale/gi) != -1
      ) {
        return this.orderDetail.orderBuySubs.find(
          (item) => item.orderType == 10
        );
      }
      return "";
    },
    balanceObj() {
      //尾款信息
      if (
        this.fromPage == "order" &&
        this.orderDetail.tags &&
        this.orderDetail.tags.search(/presale/gi) != -1
      ) {
        return this.orderDetail.orderBuySubs.find(
          (item) => item.orderType == 20
        );
      }
      return "";
    },
    isPrepay() {
      //是否预定金支付
      if (this.fromPage == "goods") {
        return this.goodsDetail.typeSale == 2;
      }
      if (this.fromPage == "order") {
        return (
          this.orderDetail.tags &&
          this.orderDetail.tags.search(/presale/gi) != -1
        );
      }
      return false;
    },

    payBtnDisabled() {
      return (
        (this.goodsDetail.showStatus && this.goodsDetail.showStatus !== 1) ||
        this.isSelfSold ||
        this.buyDisabled ||
        this.payWayIdx == -1 ||
        (this.payWayList[this.payWayIdx] &&
          this.payWayList[this.payWayIdx].payChannel == "balance" &&
          !this.isBalance)
      );
    },
    isShowRealPayMoeny() {
      //待支付订单
      if (this.orderResult) {
        if (this.deliveryType.key == 3 && this.orderResult.postPrice > 0) {
          return true;
        }
        if (this.orderResult.appendPrice > 0) {
          return true;
        }
      }

      if (this.isDiscount) {
        return true;
      } else {
        if (this.activeInfo.statusAvailable == 1) {
          if (this.activeInfo.appendPrice > 0 && this.isPaintings) {
            return true;
          }
          if (this.deliveryType.key == 3) {
            return true;
          }
        }
      }
      return false;
    },
    discountNames() {
      let str = "";
      if (this.discountAmountInfo.discountInfo) {
        str = this.discountAmountInfo.discountInfo
          .map((item) => item.name)
          .join(",");
      }

      if (this.discountAmountInfo.validDiscountName) {
        str = this.discountAmountInfo.validDiscountName
          .map((item) => item)
          .join(",");
      }
      return str ? str : "优惠卡";
    },
    isDiscount() {
      return (
        (this.discountAmountInfo &&
          this.discountAmountInfo.validDiscountName &&
          this.discountAmountInfo.validDiscountName.length > 0) ||
        (this.discountAmountInfo &&
          this.discountAmountInfo.soldDiscountInfo &&
          this.discountAmountInfo.soldDiscountInfo.length > 0)
      );
    },
    discountMoney() {
      return this.discountAmountInfo.discountAmount;

      /*   return new BigNumber(this.orderInfo.price).minus(
        this.discountAmountInfo.discountAmount
      ); */
    },
    realPriceAmount() {
      let payMoeny = this.discountAmountInfo.realPriceAmount;
      if (this.activeInfo.statusAvailable == 1) {
        if (this.activeInfo.appendPrice > 0 && this.isPaintings) {
          payMoeny = new BigNumber(payMoeny).plus(this.activeInfo.appendPrice);
        }
        if (
          this.deliveryType.key == 3 &&
          this.activeInfo.postPrice > 0 &&
          this.isPaintings
        ) {
          payMoeny = new BigNumber(payMoeny).plus(this.activeInfo.postPrice);
        }
      }
      if (this.orderResult) {
        if (this.orderResult.appendPrice > 0) {
          payMoeny = new BigNumber(payMoeny).plus(this.orderResult.appendPrice);
        }
        console.dir(payMoeny);
        if (this.deliveryType.key == 3 && this.orderResult.postPrice > 0) {
          payMoeny = new BigNumber(payMoeny).plus(this.orderResult.postPrice);
        }
        console.dir(payMoeny);
      }
      return payMoeny;
    },
    payWayName() {
      const payInfo = this.payWayList[this.payWayIdx];
      if (payInfo) {
        return payInfo.name;
      }
      return "请选择支付方式";
    },
    userAttr() {
      return this.$store.state.user_info;
    },
    isSelfSold() {
      if (
        this.goodsDetail.publisher &&
        this.goodsDetail.publisher.id == this.$store.state.user_info.userUuid
      ) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    if (localStorage.getItem("sel_address")) {
      this.addressDefault = JSON.parse(localStorage.getItem("sel_address"));
      this.deliveryType = { key: 2, val: "邮寄到付" };
    }
  },
  async created() {
    // 获取订单配置
    this.active_id = this.$route.query.active_id;

    if (this.active_id) {
      this.getActiveInfo();
    }
    if (this.$route.meta.type == "goods") {
      this.fromPage = "goods";
    } else if (this.$route.meta.type == "order") {
      this.fromPage = "order";
    }
    this.buyInfoInit();
  },
  destroyed() {
    localStorage.removeItem("sel_address");
    this.clearTimer();
  },
  watch: {
    buyList: {
      handler(val, oldVal) {
        if (oldVal && oldVal.length > 0) {
          this.calcOrder();
        }
      },
      deep: true, //true 深度监听
    },
  },
  methods: {
    async getYbUserAccountV2() {
      let res = await this.$api.service.payChannel_accountInfoList([
        {
          payChannel: "yb",
        },
      ]);
      if (res && res.data.code == 200) {
        this.ybAccountObj = res.data.data.yb;
      }
    },
    goNews(key) {
      this.$router.push(`/agreement/${key}`);
    },
    checkPayWayStatus(item) {
      if (item.payChannel == "balance" && !this.isBalance) {
        return true;
      }
      if (item.payChannel == "yb") {
        return true;
      }
    },
    toggleAddPaintings() {
      this.isPaintings = !this.isPaintings;
    },
    ybBindCardSuccess() {
      this.getYbUserAccount();
    },
    onChangeYbBanck() {
      this.$refs.YbBindCardRef.show();
    },
    async getYbUserAccount() {
      const res = await this.$api.service.payChannel_accountInfo({
        accountType: 0,
        payChannel: "yb",
      });
      if (res.data.code == 200) {
        this.ybInfo = res.data.data;
      }
    },
    showBigBanks() {
      this.$refs.BHCardsRef.show();
    },
    async getActiveInfo() {
      //获取活动信息
      const res = await this.$api.service.exhibition_getConfiguration({
        uuid: this.active_id,
      });
      if (res.data.code == 200) {
        this.activeInfo = res.data.data;
        if (this.activeInfo.statusAvailable == 1) {
          this.isShowPostWay = true;
          this.deliveryList = [];
          this.activeInfo.postType.forEach((item) => {
            switch (item) {
              case 1:
                this.deliveryList.push({ key: 1, val: "自提" });
                break;
              case 2:
                this.deliveryList.push({ key: 2, val: "邮寄到付" });
                break;
              case 3:
                this.deliveryList.push({ key: 3, val: "邮寄现付" });
                break;
            }
          });
          this.deliveryType = this.deliveryList[0];
          this.isShowDelivery = false;
          if (this.deliveryType.key == 2 || this.deliveryType.key == 3) {
            this.showConsignment();
            if (!localStorage.getItem("sel_address")) {
              this.getList();
            }
          }
        }
      }
    },

    // 初始化购买信息数据
    async buyInfoInit() {
      //初始化参数
      this.paramInit();
      this.loading = true;

      this.checkBHUserInfo();

      //this.getYbUserAccount();

      //获取用户钱包信息
      let userWalletResult = await this.getWallet();

      this.orderInfo.priceWallet = new BigNumber(
        (userWalletResult && userWalletResult.amount) || 0
      );
      if (this.fromPage == "goods") {
        //获取商品信息
        let saleRecordId = this.$route.params.id;
        this.saleRecordId = saleRecordId;
        let result = await this.$api.service.saleRecord_detail({
          id: saleRecordId,
        });

        this.goodsDetail = result.data.data;
        if (this.goodsDetail.typeSale == 2) {
          this.getYbUserAccountV2();
        }
        if (this.goodsDetail.discountAmountInfo) {
          this.discountAmountInfo = this.goodsDetail.discountAmountInfo;
        }
        this.getDiscountInfo();
        this.buyList.push({
          goods: result.data.data,
          amount: 1,
          id: saleRecordId,
        });
      } else if (this.fromPage == "order") {
        //从未支付订单来

        let orderId = this.$route.params.orderId;
        let result = await this.$api.service.orderBuy_detail({
          id: orderId,
        });
        if (result.data.code == 200) {
        } else {
          this.$message.error(result.data.message);
          return;
        }
        result = result.data.data;

        this.orderDetail = result;
        if (
          this.orderDetail &&
          this.orderDetail.tags &&
          this.orderDetail.tags.search(/presale/gi) != -1
        ) {
          this.getYbUserAccountV2();
        }
        if (result.discountAmountInfo) {
          this.discountAmountInfo = {
            discountAmount: new BigNumber(result.price).minus(
              result.discountAmountInfo.discountAmount
            ),
            realPriceAmount: result.discountAmountInfo.discountAmount,
            saleRecordAmount: result.amount,
            totalPriceAmount: result.price,
            validDiscountName: result.discountAmountInfo.soldDiscountInfo
              ? result.discountAmountInfo.soldDiscountInfo.map(
                  (item) => item.commodityName
                )
              : [],
          };
        } else {
          this.discountAmountInfo = {
            discountAmount: 0,
            realPriceAmount: result.price,
            saleRecordAmount: result.amount,
            totalPriceAmount: result.price,
            validDiscountName: [],
          };
        }

        //交易状态 0待支付 1待发货 2已发货 3已完成 4已取消
        if (result.statusTrade != 0) {
          this.$router.push({
            path: "/404",
          });
        }
        this.saleRecordId = result.saleRecordId;
        this.discountParams.saleRecordAmount = result.amount;

        /*    this.getDiscountInfo(); */
        this.buyList.push({
          goods: result,
          amount: result.amount,
        });

        this.orderNo = result.orderBuyNo;
        // 取消
        await this.expirePayOrder();
        this.orderResult = result;
        if (result.postInfo && result.postInfo.sendType == 2) {
          this.deliveryType = { key: 2, val: "邮寄到付" };
        }
        if (result.postInfo && result.postInfo.sendType == 3) {
          this.deliveryType = { key: 3, val: "邮寄现付" };
        }
      }
      this.getPayWays();
      if (this.buyList.length == 0) {
        this.$router.push({
          path: "/404",
        });
      }

      this.loading = false;
    },
    async getPayWays() {
      //获取支付渠道

      let res = await this.$api.service.thirdAccount_sellerChannel_v2({
        saleRecordId: this.saleRecordId,
        needWallet: false,
        needLl: true,
        isBreachOrder: 0,
        version: 1,
      });
      if (res.data.code == 200) {
        this.selectLabel = "name";
        /*      if (this.isPrepay) {
          this.payWayList = res.data.data
            .map((item, idx) => {
              item.index = idx;
              item.disable = false;
              return item;
            })
            .filter((item) => item.payChannel == "yb");
          return;
        } */
        const balancePaystatus = res.data.data.find(
          (item) => item.payChannel == "balance"
        );
        if (
          !this.isBalance ||
          (balancePaystatus && balancePaystatus.sellerStatus == 1) ||
          (balancePaystatus && balancePaystatus.buyerStatus == 1)
        ) {
          //买家余额不足,优先选择易宝
          let payIdx = 0;
          res.data.data.forEach((item, index) => {
            if (item.payChannel == "yb" && item.sellerStatus == 0) {
              payIdx = index;
            }
          });
          if (!payIdx) {
            payIdx = -1; /* res.data.data.findIndex((item) => {
              return item.payChannel != "yb" && item.payChannel != "balance";
            }); */
          }
          this.payWayIdx = payIdx;
        }

        this.payWayList = res.data.data.map((item, idx) => {
          item.index = idx;
          item.disable = false;

          if (item.payChannel == "balance") {
            if (item.buyerStatus == 0 && item.sellerStatus == 0) {
              if (!this.isBalance) {
                item.disable = true;
                item.desc = "可用余额不足";
              } else {
                item.disable = false;
              }
            } else {
              item.disable = true;
              if (!item.desc) {
                item.desc = "不支持该支付渠道";
              }
            }
          }
          if (item.payChannel == "yb" && item.sellerStatus == 1) {
            item.disable = true;
          }
          if (item.payChannel == "ll" && item.sellerStatus == 1) {
            item.disable = true;
          }
          if (
            item.payChannel == "baofoo" &&
            item.payType == 4 &&
            item.sellerStatus == 1
          ) {
            item.disable = true;
          }
          return item;
        });
      } else {
        this.$message.error(res.data.message);
      }
    },

    // 获取钱包余额
    async getWallet() {
      let result = await this.$api.service.userWallet_get();
      let userWalletResult = result.data.data;
      console.log(`钱包余额`, userWalletResult);
      return userWalletResult;
    },
    goHyBindBank() {
      //
      this.$refs.HyBindCardRef.show();
    },

    //切换支付方式
    onPayWayChange(idx) {
      const payWay = this.payWayList[idx];

      if (payWay.key == 3) {
        this.$message.warning("移动端支付预计在3月23日开放，敬请期待。");
        // 该支付通道今日收款限额已满，需要等待支付通道释放新的额度，新的额度一般次日发放。
        return;
      }
      if (this.$common.isMobile() && payWay.key == 2) {
        //手机端网银支付
        this.$message.warning("请移步至PC端进行支付");
        return;
      }
      this.payWayIdx = idx;
    },

    showBaohuCards() {
      this.$refs.BHCardsRef.show();
    },
    goBindBank() {
      this.$refs.bhBindCardRef.show();
    },
    showBanks() {
      this.$refs.BHSmallCardsRef.show();
    },
    async bindcardChange() {
      await this.checkBHUserInfo();
    },
    onChangeBanck() {
      this.$refs.bhBindCardRef.show();
    },
    //去宝户设置支付密码(废弃)
    async onSetPassword() {
      const res = await this.$api.service.baofooInfo_setBaofooPassword();
      if (res.data.code == 200) {
        setTimeout(() => {
          this.isShowSetPassword = false;
          this.$confirm("已经设置好宝户密码？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }).then(async () => {
            await this.checkBHUserInfo();
            this.onSubmitOrder();
          });
        }, 500);
        const url = `${window.location.origin}/bh_password_result?refer=${window.location.href}`;
        const urlRes = `${res.data.data}?Address=${encodeURIComponent(url)}`;

        if (this.$common.isMobile()) {
          window.location.href = urlRes;
        } else {
          window.open(urlRes);
        }
      } else {
        this.$message.error(res.data.message);
      }
      //
    },
    //查询用户宝户信息
    async checkBHUserInfo(amount) {
      //检查用户宝户信息
      const res = await this.$api.service.payChannel_accountInfo({
        payChannel: "baofoo",
      });
      if (res.data.code == 200) {
        const info = res.data.data;

        this.baohuInfo = info;
      } else {
        this.$message.error(res.data.message);
      }
    },

    // /// // /// // /// // /// // /// // /// // /// // //订单源数据 // /// // /// // /// // /// // /// // /// // /// // ///

    async expirePayOrder() {
      //取消订单
      let cancelResult = await this.$api.service.v3_pay_expirePayOrder({
        orderNo: this.orderNo,
      });
      console.log(`设置支付订单为失效状态`, cancelResult);
    },
    // /// // /// // /// // /// // /// // /// // /// // /// // /// // /// // /// // /// // /// // /// // /// // /// // /// // /// // ///
    // 刷新  无可用库存时可进行刷新操作
    onReload() {
      this.buyInfoInit();
    },

    // 更改数量检测余额
    async handleChange(val, oldVal, item) {
      this.elNumberDisabled = true;

      this.discountParams.saleRecordAmount = val;
      this.getDiscountInfo(item, val, oldVal);
    },
    async getDiscountInfo(item, val, oldVal) {
      //获取实际可支付信息
      let res = {};
      if (this.isPrepay) {
        res = await this.$api.service.goods_saleRecord_getRealPriceInfo({
          ...this.discountParams,
          saleRecordUuid: this.saleRecordId,
        });
      } else {
        res = await this.$api.service.saleRecord_getRealPriceInfo({
          ...this.discountParams,
          saleRecordUuid: this.saleRecordId,
        });
      }

      this.elNumberDisabled = false;
      if (res.data.code == 200) {
        this.buyDisabled = false;
        if (val && item) {
          item.amount = val;
        }
        this.discountAmountInfo = res.data.data;
      } else if (res.data.code == 40059) {
        if (item) {
          item.amount = oldVal;
        } else {
          this.buyDisabled = true;
        }

        this.$message.error(res.data.message);
      } else {
        if (item) {
          item.amount = oldVal;
        }

        if (!item) {
          this.buyDisabled = true;
        }

        this.$message.error(res.data.message);
      }
    },
    // 计算订单金额 及付款方式
    calcOrder() {
      this.orderInfo.price = 0; //总价
      this.orderInfo.amount = 0; //总数量
      this.buyList.forEach((a) => {
        this.orderInfo.amount += a.amount; //计算总数量
        //如果是订单页面直接使用总价;
        this.orderInfo.price =
          this.fromPage == "order"
            ? new BigNumber(a.goods.price)
            : new BigNumber(a.goods.price).times(a.amount); //计算总价
      });
      if (this.isPrepay) {
        if (this.orderInfo.priceWallet.comparedTo(0) == 0) {
          this.isBalance = false;
        } else if (this.isDeposit) {
          const depositAmount =
            (this.discountAmountInfo.presaleInfo &&
              this.discountAmountInfo.presaleInfo.depositAmount) ||
            (this.goodsDetail.presaleInfo &&
              this.goodsDetail.presaleInfo.depositAmount);

          this.isBalance = !(
            this.orderInfo.priceWallet.comparedTo(depositAmount) < 0
          );
        } else if (this.isPayment) {
          //如果支付尾款
          this.isBalance = !(
            this.orderInfo.priceWallet.comparedTo(
              this.balanceObj.presaleAmountExt.balanceAmount
            ) < 0
          );
        } else {
        }
      } else {
        if (this.orderInfo.priceWallet.comparedTo(0) == 0) {
          //无法使用余额
          this.isBalance = false;
        } else if (
          this.orderInfo.priceWallet.comparedTo(this.orderInfo.price) < 0
        ) {
          // 余额<商品总金额
          this.isBalance = false;
        } else {
          //可以使用余额
          this.isBalance = true;
          //如果支付定金
        }
      }
    },

    // 页面按钮触发 提交订单
    async onSubmitOrder() {
      const payWay = this.payWayList[this.payWayIdx];
      if (
        this.ybAccountObj.status != 1 &&
        this.isPrepay &&
        payWay &&
        payWay.payChannel == "yb"
      ) {
        this.$confirm(
          `为了保证您的交易权益，预售订单请完成${this.payWayName}的开户认证`,
          "提示",
          {
            confirmButtonText: "去认证",
            cancelButtonText: "取消",
            customClass: "mobile-btn-center",
          }
        )
          .then(async () => {
            this.$router.push(`/mine/wallet/account_manage`);
          })
          .catch(() => {});
        return;
      }
      if (this.isDeposit) {
        if (!this.isPrepayAgreement) {
          this.$message.warning("请先勾选协议");
          return;
        }
        this.$confirm(`预售商品，定金不退！是否继续下单`, "提示", {
          confirmButtonText: "同意下单",
          cancelButtonText: "我再想想",
          customClass: "mobile-btn-center",
        })
          .then(async () => {
            this.onSubmitOrderNext();
          })
          .catch(() => {});
      } else {
        this.onSubmitOrderNext();
      }
    },
    onSubmitOrderNext() {
      if (this.payBtnDisabled) {
        return;
      }
      const payWay = this.payWayList[this.payWayIdx];

      if (this.$common.isMobile() && payWay.payChannel == "baofoo") {
        this.isShowBigPayTip = true;
        return;
      }
      if (!payWay) {
        this.$message.warning("请选择支付方式");
        return;
      }
      if (!this.userAttr.userUuid) {
        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.href
        )}`;
        return;
      }
      // 从商品详情进行提交订单
      /*       if (this.fromPage == "goods") {
        // 商品可用数量为0 禁止进行下单
        if (this.orderInfo.showStatus !== 1 ||  this.isSelfSold) {
          return;
        }
      } */

      //判断用户是否已认证
      if (this.userAttr.statusVerified == 1) {
        //已认证
        //交易密码验证
        //判断支付方式
        switch (payWay.payChannel) {
          case "baofoo":
            if (payWay.payType == 4) {
              //宝户网银支付
              this.$refs.BigPayRef.show();
            } else if (payWay.payType == 3) {
              //宝户协议支付
              if (this.baohuInfo.statusBankCard !== 1) {
                //尚未绑定银行卡
                this.$refs.bhBindCardRef.show();
                return;
              }
              if (this.baohuInfo.statusPassword !== 1) {
                //尚未设置宝户支付密码
                this.isShowSetPassword = true;
                return;
              }

              this.orderSubmitAndPay();
            }

            break;
          case "balance":
            //恒信通余额支付
            if (this.isBalance) {
              this.payPwdHandle();
            } else {
              this.$message.warning("余额不足");
            }
            break;
          case "hy":
            //汇元支付
            this.$refs.HyPay.show();
            document.documentElement.scrollTop = 0;
            break;
          case "hxt":
            //恒信通支付宝支付
            this.orderSubmitAndPay();
            break;
          case "yb":
            //恒信通支付宝支付
            this.orderSubmitAndPay();
            break;
          case "ll":
            this.orderSubmitAndPay();
            break;
          default:
            this.$message.warning("未支持的支付方式");
            break;
        }
      } else {
        // 未认证 弹出认证框
        this.$refs.nameVerified.init();
        return;
      }
    },
    // 订单提交支付 订单存在直接支付，订单不存在自动生成订单
    async orderSubmitAndPay(params, bankInfo) {
      if (this.buyDisabled) {
        return;
      }
      this.payParamsg = {
        params,
        bankInfo,
      };
      this.bankInfo = bankInfo ? bankInfo : {};

      if (!this.orderNo) {
        //认证
        this.createOrder();
        /*    this.$common.initGeetest({
          success: this.createOrder,
          id: 4,
          api: "/order/api/orderBuy/add",
        }); */
      } else {
        this.buyDisabled = true;
        this.flag.submitBtn = true;
        this.currentBankInfo = this.bankInfo;
        this.orderSUbmitAndPayAuth();
      }
    },
    async orderSUbmitAndPayAuth() {
      const { params, bankInfo } = this.payParamsg;

      this.flag.submitBtn = false;
      if (this.orderNo) {
        // 下单成功调起支付
        await this.expirePayOrder();
        this.payTime = true;
        let resPassword = "";
        if (this.payPassword) {
          //如果需要支付密码则进行加密
          resPassword = await Encryption.getPassword(this.payPassword);
          if (!resPassword) {
            this.$message.warning("密码加密错误");
            return;
          }
        }
        const payWay = this.payWayList[this.payWayIdx];
        let payParam = {
          orderNo: this.orderNo,
          payChannel: payWay.payChannel,
          clientType: this.$common.isMobile() ? 2 : 1,
          payType: payWay.payType,
          subject: this.buyList[0].goods.commodity.name,
          payPw: resPassword, //支付密码仅余额支付使用
        };
        if (JSON.stringify(this.currentBankInfo) !== "{}") {
          payParam.bankCardUUID = this.currentBankInfo.uuid;
        }
        if (params) {
          //payBankUuid
          payParam = { ...payParam, ...params };
        }
        /*    if (this.isDiscount) { */
        //如果买家有折扣
        let amountPay = this.realPriceAmount;
        let showAmount = this.discountAmountInfo.totalPriceAmount;

        if (this.isPrepay) {
          if (this.isDeposit) {
            //定金
            payParam = {
              ...payParam,
              preOrderType: 10,
            };
            if (this.fromPage == "order") {
              payParam.orderNo = this.depositObj.orderNoSub;
              amountPay = this.depositObj.presaleAmountExt.depositAmount;
            } else {
              // amountPay = this.goodsDetail.presaleInfo.depositAmount;
              amountPay =
                (this.discountAmountInfo &&
                  this.discountAmountInfo.presaleInfo.depositAmount) ||
                this.goodsDetail.presaleInfo.depositAmount;
            }
          }
          if (this.isPayment) {
            //尾款
            payParam = {
              ...payParam,
              preOrderType: 20,
            };
            if (this.fromPage == "order") {
              payParam.orderNo = this.balanceObj.orderNoSub;
              amountPay = this.balanceObj.presaleAmountExt.balanceAmount;
            }
          }

          //30违约单
        }
        payParam = {
          ...payParam,
          amountPay: this.$common.formatMoneyNum(amountPay),
          showAmount: this.$common.formatMoneyNum(showAmount),
        };

        if (payWay.payChannel == "ll") {
          let link = `/ll_bag/pay?order_no=${
            payParam.orderNo
          }&amount_pay=${amountPay}&show_amount=${showAmount}&goods_name=${encodeURIComponent(
            this.buyList[0].goods.commodity.name
          )}`;
          if (payParam.preOrderType) {
            link = `${link}&pre_order_type=${payParam.preOrderType}`;
          }
          console.log(link);
          window.location.href = link;
          return;
        }
        let payResult = await this.$api.service.v3_pay(payParam);
        this.buyDisabled = false;
        if (payResult.data.code == 200 && payResult.data.data) {
          const payResultInfo = payResult.data.data;
          this.payResultHandle(payResultInfo);
        } else {
          this.$message.error(payResult.data.message);
          /*      if (payWay.payChannel == "hy") {
            this.$message.error(
              "该渠道已达今日收款限额，请更换其他支付方式或明日再试"
            );
          } else {

          } */
        }
      }
    },
    payResultHandle(payResultInfo) {
      //支付结果处理
      const payWay = this.payWayList[this.payWayIdx];
      switch (payResultInfo.payChannel) {
        case "baofoo":
          if (payWay.payType == 4) {
            //网银支付（宝户）
            createForm(payResultInfo.detail, true);
            setTimeout(() => {
              this.$confirm(
                `您是否成功支付该订单？支付成功请点击是，未完成支付请点击否。`,
                "提示",
                {
                  confirmButtonText: "是",
                  cancelButtonText: "否",
                  // type: "warning",
                }
              )
                .then(async () => {
                  const payRes = await this.$api.service.pay_confirmBaofooPay({
                    orderNo: this.orderNo,
                  });
                  if (payRes.data.code == 200) {
                    this.$router.push({
                      path: "/order/success",
                    });
                  } else {
                    this.$message.error(payRes.data.message);
                  }
                })
                .catch(() => {});
            }, 500);
          } else if (payWay.payType == 3) {
            const url = `${window.location.origin}/bh_pay_result?order_no=${this.orderNo}`;
            const urlRes = `${
              payResultInfo.detail
            }?Address=${encodeURIComponent(url)}`;
            window.location.href = urlRes;
          }

          break;
        case "balance":
          //余额支付
          if (payResultInfo.detail.status == "SUCCESS") {
            this.$message.success("支付成功");
            this.$router.push({
              path: "/order/success",
            });
          } else {
            this.$message.error("支付失败");
          }
          break;
        case "hy":
          //会元支付
          if (payResultInfo.status == "normal") {
            if (payResultInfo.detail.status == "SUCCESS") {
              this.$refs.HyPayCodeRef.show({
                outTradeNo: payResultInfo.detail.outTradeNo,
                orderNo: this.orderNo,
              });
            } else {
              this.$message.error("fail");
            }
          } else {
            // alert(payResultInfo.status);
            if (
              payResultInfo.errorMessage.search(
                /商户2135871子商户0支付类型=63当日支付合计超过限额1000/gi
              ) == -1
            ) {
              this.$message.error(payResultInfo.errorMessage);
            } else {
              this.$message.warning(
                "该渠道已达今日收款限额，请更换其他支付方式或明日再试"
              );
            }
          }
          break;
        case "hxt":
          if (this.$common.isMobile()) {
            window.location.href = payResultInfo.detail;
          } else {
            //pc自己生成二维码
            this.$refs.PayCode.init(
              `${payResultInfo.detail}&source=ON_PC`,
              this.orderNo,
              1
            );
          }
          break;
        case "yb":
          if (payResultInfo.status == "jump") {
            window.location.href = payResultInfo.detail;
          } else {
            this.$message.error(payResultInfo.errorMessage);
          }

          /*           setTimeout(() => {
            this.$confirm(
              `您是否成功支付该订单？支付成功请点击是，未完成支付请点击否。`,
              "提示",
              {
                confirmButtonText: "是",
                cancelButtonText: "否",
                // type: "warning",
              }
            )
              .then(async () => {})
              .catch(() => {});
          }, 500); */

          /*       if (this.$common.isMobile()) {
            window.location.href = payResultInfo.detail;
          } else {
            window.open(payResultInfo.detail);
          } */
          break;
        default:
          if (payResultInfo.status == "jump") {
            //hxt可以直接条装
            window.location.href = payResultInfo.detail;
          } else if (payResultInfo.status == "needBindCard") {
            alert("绑卡");
          }
          break;
      }
    },
    //支付密码处理   如果使用余额付款及组合支付 需输入支付密码
    payPwdHandle() {
      //判断是否有支付密码
      if (this.userAttr.isPayPwd == 0) {
        // 没有支付密码 去设置支付密码
        this.$refs.setPayPassword.init();
        return false;
      } else {
        // 有支付密码输入支付密码
        this.$refs.inPayPassword.init();
        return false;
      }
    },

    // 创建订单 生成订单编号
    async createOrder() {
      this.buyDisabled = true;
      this.flag.submitBtn = true;
      this.currentBankInfo = this.bankInfo;
      let orderAddParam = [];
      let jsondata;
      let addressInfo = {};
      if (!this.goodsDetail.online) {
        if (this.active_id) {
          addressInfo.onlineType = 3;
        } else {
          addressInfo.onlineType = 2;
        }
        if (
          this.deliveryType.key == 2 ||
          (this.deliveryType.key == 3 && this.isPaintings)
        ) {
          if (this.$common.isMobile()) {
            if (this.active_id && !this.addressDefault.addressDetail) {
              this.showConsignment();
              this.buyDisabled = false;
              this.flag.submitBtn = false;
              return;
            }
            addressInfo.postInfo = {
              address: this.addressDefault.addressDetail,
              areaCode: this.addressDefault.areaCode,
              areaName: this.addressDefault.area,
              cityCode: this.addressDefault.cityCode,
              cityName: this.addressDefault.city,
              name: this.addressDefault.contactsName,
              phone: this.addressDefault.contactsPhone,
              provinceCode: this.addressDefault.provinceCode,
              provinceName: this.addressDefault.province,
            };
          } else {
            let address = this.addressList.filter((item, index, arr) => {
              return item.isCheck == true;
            });
            if (this.active_id && !address[0]) {
              this.showConsignment();
              this.buyDisabled = false;
              this.flag.submitBtn = false;
              return;
            }
            addressInfo.postInfo = {
              address: address[0].addressDetail,
              areaCode: address[0].areaCode,
              areaName: address[0].area,
              cityCode: address[0].cityCode,
              cityName: address[0].city,
              name: address[0].contactsName,
              phone: address[0].contactsPhone,
              provinceCode: address[0].provinceCode,
              provinceName: address[0].province,
            };
          }
        }
        console.dir(this.deliveryType.key);
        if (this.isPaintings) {
          addressInfo.sendType = this.deliveryType.key;
        } else {
          addressInfo.sendType = 0;
        }
      }
      let preOrderType = "";
      this.buyList.forEach((b) => {
        let params = {
          saleRecordAmount: b.amount,
          saleRecordId: b.goods.id,
        };
        /*         if (this.isDiscount) { */

        let amountPay = this.realPriceAmount;

        if (this.isPrepay) {
          if (this.isDeposit) {
            //定金
            preOrderType = 10;
            if (this.fromPage == "goods") {
              // amountPay = this.goodsDetail.presaleInfo.depositAmount;

              amountPay =
                (this.discountAmountInfo &&
                  this.discountAmountInfo.presaleInfo.depositAmount) ||
                this.goodsDetail.presaleInfo.depositAmount;
            } else if (this.fromPage == "order") {
              amountPay = this.depositObj.presaleAmountExt.depositAmount;
            }
          }
          if (this.isPayment) {
            //尾款
            preOrderType = 20;
            if (this.fromPage == "goods") {
              amountPay = this.goodsDetail.presaleInfo.balanceAmount;
            } else if (this.fromPage == "order") {
              amountPay = this.balanceObj.presaleAmountExt.balanceAmount;
            }
          }

          params.orderType = 1;
        }

        params.amountPay = this.$common.formatMoneyNum(amountPay);
        if (this.active_id && this.isPaintings) {
          params.appendUuid = this.active_id;
        }
        orderAddParam.push({ ...params, ...addressInfo });
      });
      // TODO 有邀请码需要换成invite_addOrder接口
      let inviteCode = sessionStorage.getItem("inviteCode");
      let api = this.$api.service.orderBuy_add
      // 有 inviteCode 使用邀请的下单接口
      if (inviteCode) {
        api = this.$api.service.invite_addOrder
        orderAddParam = orderAddParam.map(item => {
          return {
            ...item,
            inviteCode,
            activityType: 1 // 活动类型,1 拉新
          }
        })
      }
      let result = await api(orderAddParam);
      if (result.data.code == 200) {
        const payWay = this.payWayList[this.payWayIdx];
        this.orderNo = result.data.data;
        localStorage.setItem("orderNo", this.orderNo);
        this.orderTime.remainTime = this.orderTime.configTime;
        const amountPay =
          this.discountAmountInfo.realPriceAmount || this.orderInfo.price;
        const showAmount = this.orderInfo.price;
        if (payWay.payChannel == "ll") {
          this.buyDisabled = false;
          this.flag.submitBtn = false;
          /*        let link = `/ll_bag/pay?order_no=${
            this.orderNo
          }&amount_pay=${this.$common.moneyFormat2(
            this.realPriceAmount
          )}&show_amount=${showAmount}&goods_name=${
            this.buyList[0].goods.commodity.name
          }`;
          if (preOrderType) {
            link = `${link}&pre_order_type=${preOrderType}`;
          }

          this.$router.push(link); */
          this.orderSUbmitAndPayAuth();
          return;
        } else {
          this.orderSUbmitAndPayAuth();
        }
        //   console.info(`订单剩余时间`, this.orderTime.remainTime);
        // this.createTimer();
      } else {
        this.buyDisabled = false;
        this.flag.submitBtn = false;
        if (result.data.code == 10002) {
          this.$message.warning("此商品已下架");
        } else {
          this.$message.error(result.data.message);
        }
      }
    },
    async crateOrderAuth() {},

    //实名认证
    async listenNameVerified(result) {
      if (result.result) {
        console.log(`认证通过`);
        if (this.payPwdHandle()) {
          await this.orderSubmitAndPay();
        }
      }
    },
    //设置支付密码
    async listenSetPayPassword(result) {
      if (result.result) {
        this.payPassword = result.result;
        console.log(`支付密码`, this.payPassword);
        await this.orderSubmitAndPay();
      }
    },

    // 输入支付密码
    async listenInPayPassword(result) {
      if (result.result) {
        this.payPassword = result.result;
        console.log(`支付密码`, this.payPassword);
        await this.orderSubmitAndPay();
      }
    },

    // 显示大图
    showBigPic(key) {
      document.getElementById(key).click();
    },
    // 返回详情页
    goBack() {
      if (this.fromPage == "goods") {
        this.$router.push({
          path: `/goods/${this.$route.params.id}`,
        });
      } else {
        this.$router.push({
          path: `/mine/buy?page=1`,
        });
      }
    },
    // 订单参数初始化
    paramInit() {
      this.currentBankInfo = {};
      this.orderInfo = {
        amount: 0, //商品总数
        price: new BigNumber(0), //商品总价格
        pricePay: new BigNumber(0), //应付价格
        priceWallet: new BigNumber(0), //可用余额
        payType: 0, // 支付方式 0默认 无余额   1余额支付  2余额不足组合支付
      };
      this.buyList = [];
    },
    hyBindCardSuccess() {
      this.$refs.HyPay.upBank();
    },

    // 倒计时

    createTimer() {
      this.clearTimer();
      this.orderTime.timer = setInterval(() => {
        // console.log(`计时器在工作`, this.orderTime.remainTime);
        this.orderTime.remainTime--;
        if (this.orderTime.remainTime <= 0) {
          this.clearTimer();
          this.$router.push({
            path: "/order/fail",
          });
        }
      }, 1000);
    },
    clearTimer() {
      if (this.orderTime.timer) {
        clearInterval(this.orderTime.timer);
      }
      this.orderTime.timer = null;
    },
    setSelectItem(option, item) {
      if (item.disable) {
        return;
      }
      this.isBalancePop = false;
      this.payWayIdx = option;
    },
    setDelivery(info) {
      this.deliveryType = { key: info.key, val: info.val };
      this.isShowDelivery = false;
      if (info.key == 2 || info.key == 3) {
        if (!this.active_id) {
          this.showConsignment();
        }
        if (!localStorage.getItem("sel_address")) {
          this.getList();
        }
      }
    },
    goAddress() {
      this.$router.push({
        path: "/mine/setting/address-manage/address-mobile",
        query: {
          type: 1,
        },
      });
    },
    setAddress(item) {
      for (let i = 0; i < this.addressList.length; i++) {
        if (this.addressList[i].isCheck) {
          this.addressList[i].isCheck = false;
        }
        if (item.uuid == this.addressList[i].uuid) {
          this.addressList[i].isCheck = true;
        }
      }
      this.addressList = JSON.parse(JSON.stringify(this.addressList));
      this.onPcAddress = false;
    },
    onSetting(item) {
      if (this.addressList.length >= 20) {
        this.$message.warning("最多创建20个地址");
        return;
      }
      if (item) {
        this.$refs["editorAddress"].init(item);
      } else {
        this.$refs["editorAddress"].init();
      }
    },
    async getList() {
      const res = await this.$api.service.address_list();
      console.log(res);
      if (res.data.code == 200) {
        this.addressList = res.data.data;
        let address = res.data.data.filter((item, index, arr) => {
          return item.isDefault == 1;
        });
        if (!address || address.length == 0) {
          this.setAddress(this.addressList[0]);
        } else {
          this.addressDefault = address[0];
          this.setAddress(address[0]);
          console.dir(this.addressDefault);
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    delAddress(item) {
      this.$confirm(`确定要删除该地址么？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          const res = await this.$api.service.address_delete({
            uuid: item.uuid,
          });
          console.log(res);
          if (res.data.code == 200) {
            this.$message.success("删除成功");
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(() => {});
    },
    async setDefault(item) {
      item.isDefault = 1;
      const res = await this.$api.service.address_update(item);
      if (res.data.code == 200) {
        this.$message.success("设置默认地址成功");
        this.getList();
      } else {
        this.$message.error(res.data.message);
      }
    },
    onCancelC(e) {
      console.dir(e);
      if (this.countDown) {
        this.countDown.stop();
        if (!this.active_id) {
          this.deliveryType = { key: 1, val: "自提" };
        }
        this.isShowConsignment = false;
      }
    },
    clearDeliveryType() {
      if (!this.active_id) {
        this.deliveryType = { key: 1, val: "自提" };
      }
    },
    onIAgree() {
      this.isShowConsignment = false;
      if (this.$common.isMobile()) {
        if (
          !this.addressDefault ||
          Object.keys(this.addressDefault).length == 0
        ) {
          this.goAddress();
        }
      } else {
        if (this.addressList.length == 0) {
          this.$refs["editorAddress"].init("pc-init");
        }
      }
    },
    showConsignment() {
      this.isDownOver = false;
      this.isShowConsignment = true;
      this.getConsignment();
      if (this.countDown) {
        this.countDown.stop();
        this.countDown = null;
      }
      if (this.active_id) {
        this.countDown = new countDown({
          cdTime: 1,
          tickCall: (obj) => {
            this.btnTxt = `请阅读全文`;
          },
          endCall: () => {
            this.btnTxt = `请阅读全文`;
            this.isDownOver = true;
          },
        });
      } else {
        this.countDown = new countDown({
          cdTime: 6,
          tickCall: (obj) => {
            this.btnTxt = `请阅读全文:${obj.cdTime}s`;
          },
          endCall: () => {
            this.btnTxt = `请阅读全文`;
            this.isDownOver = true;
          },
        });
      }
    },
    async getConsignment() {
      if (this.active_id) {
        this.consignmentHtml =
          "若您在购买版权品后选择委托唯一艺术平台邮寄实体画作的，平台工作人员将在1-3个工作日处理邮寄订单。您知悉并同意一旦附赠实体画作货交承运人即视为唯一艺术平台完成邮寄交付义务，若因邮寄出现丢失、破损等现象而造成无法收件的后果，与唯一艺术平台无关，藏家有权自行向快递公司等责任方进行追偿。";
      } else {
        this.consignmentHtml =
          "藏品买家可自行选择为藏品提供到付寄送服务的物流/快递公司，唯一艺术平台提供必要协助，<span style='color:#E61F1A'>邮寄所产生到付费用需藏品买家自行承担，实际产生费用按展览地各物流及快递公司收费标准收取；</span>因邮寄出现丢失、破损等现象而造成无法收件的后果，由藏品买家自负，与唯一艺术平台无关。工作人员将在1-3个工作日处理邮寄订单。";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";
.warning-text {
  font-size: 12px;
  font-weight: 400;
  color: #e61f1a;
  line-height: 17px;
  text-align: right;
  margin-top: 14px;
}
@media screen and (max-width: 540px) {
  .mobile-text-left {
    text-align: left;
  }
}

.prepay-money-line {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.icon-gift {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/icon-gift.png");
}
.icon-agreement-radius {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/icon-select.png");
}
.icon-agreement-radius-checked {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/icon-selected.png");
}
.prepay-agreement-wrap {
  display: flex;
  font-size: 12px;
  font-weight: 400;
  color: #666666;
  justify-content: flex-end;
  .agreement-content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .link {
    color: #397fe7;
  }
  .ui-icon {
    width: 12px;
    height: 12px;
    margin-right: 2px;
  }
  @media screen and (max-width: 540px) {
    justify-content: flex-start;
    .agreement-content {
      display: block;
      word-break: break-all;
    }
  }
}
.add-paintings-wrap {
  display: flex;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(153, 153, 153, 0.1);
  margin-bottom: 24px;
  justify-content: space-between;
  align-items: center;
  .price {
    font-size: 14px;
    color: #e61f1a;
  }
  .icon-select {
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/goods-detail/icon-select.png");
  }
  .icon-selected {
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/goods-detail/icon-selected.png");
  }
  .icon-radius {
    margin-right: 12px;
    width: 18px;
    height: 18px;
  }
  .icon-gift {
    margin-right: 4px;
  }
  .ui-icon {
    position: relative;
    top: -1px;
    left: 0;
  }
  .content {
    display: flex;
    align-items: center;
    .txt {
      font-size: 14px;
      font-weight: 400;
      color: #000000;
    }
  }
}
.through-line {
  text-decoration: line-through;
}
.num-wrap {
  display: flex;
}
.img-wrap {
  width: 220px;
  padding-right: 40px;
  ::v-deep .goods-frame-box {
    padding: 0;
    border: 0;
    .frame-box {
      padding: 12px;
    }
  }
  @media screen and (max-width: 540px) {
    width: 100%;
    padding-right: 0;
    margin-top: 0;
  }
}
.big-bank-tip {
  text-align: right;
}
.warning-color {
  color: #e61f1a !important;
  font-size: 14px;
}
.v1-main {
  min-height: 50vh;
}
.m-success-wrap {
  text-align: center;
  .ui-title {
    color: #333333;
    text-align: center;
    margin: 6px auto 15px;
  }
  .icon-success {
    width: 180px;
    margin: 0 auto;
  }
}
.bh-bind-card-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 0 200px;
  z-index: 99;
  ::v-deep .ui-content-wrap {
    max-width: 1200px;
    margin: 60px auto 0;
    background: #ffffff;
    height: 100%;

    padding: 28px 46px 35px;
    /*     box-shadow: 0px 0px 9px 4px rgba(164,164 ,164, .1); */
    border-radius: 4px;
  }
}
.selecte-cards-wrap {
}
.ui-section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 0 200px;
  z-index: 99;
}
.m-pay-tip {
  text-align: right;
}
.blue {
  color: rgba(57, 127, 231, 1) !important;
}
.big-pay-warning-tip {
  color: #e61e1a;
  font-size: 14px;
  display: inline-block;
  padding-right: 10px;
}
.m-success-wrap {
  .warning {
    color: #ff7a64;
    margin-top: 0.5rem;
  }
  .btn-group {
    margin-top: 0.78rem;
  }
}
.m-copy-blue {
  ::v-deep .m-copy {
    .txt {
      color: rgb(32, 129, 226);
    }
  }
}
.mobile {
  display: none;
}
.pc-wrap {
  display: block;
}
.page-order-add {
  padding: 73px 0 100px;
  position: relative;
  top: 0;
  left: 0;

  .loading {
    height: 500px;
  }
  .order-info {
    padding: 0 32px 44px;
    background: #ffffff;
    box-shadow: 0px 0px 9px 4px rgba(164, 164, 164, 0.1);
    border-radius: 4px;
    h1 {
      font-size: 14px;
      color: #333333;
      line-height: 68px;
    }
    .goods-info {
      display: flex;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.05);
      margin-bottom: 24px;
      align-items: center;
      .cover {
        width: 197px;
        height: 197px;
        background: #ffffff;
        border: 1px solid #d9d9d9;
        position: relative;
        margin-right: 54px;
        cursor: pointer;
        img {
          position: absolute;
          max-height: 100%;
          max-width: 100%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .info {
        flex: 1;
        color: #666666;
        line-height: 17px;
        display: flex;
        flex-direction: column;
        .line {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin: 10px 0;
        }
        .line-10 {
          margin: 5px 0;
        }
        h1 {
          width: 24px + 48px;
          // font-size: 12px;
          line-height: 17px;
          color: #999999;
        }
        h2 {
          font-size: 14px;
          line-height: 17px;
          font-weight: 500;
          color: #e61f1a;
        }
        h3 {
          font-size: 12px;
          line-height: 17px;
          color: #666666;
        }
        p {
          flex: 1;
          i {
            display: inline-block;
            width: 21px;
            height: 21px;
            border-radius: 50%;
            overflow: hidden;
            vertical-align: text-top;
            background-size: cover;
          }
        }
      }
    }
    .address-pc {
      padding-top: 23px;
      border-top: 1px solid #f4f4f4;
      .label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        span {
          font-size: 12px;
          color: #397fe7;
          cursor: pointer;
        }
      }
      .address-ul-active {
        padding: 7px 0;
      }
      .address-ul {
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        max-height: 160px;
        overflow: auto;
        .address-ul-li {
          display: flex;
          padding: 9px 20px;
          .radio {
            width: 18px;
            height: 18px;
            margin-right: 16px;
            background-image: url("~@/assets/1.0/images/address-pc-check-no.png");
            background-size: 100% 100%;
          }
          .radio-active {
            background-image: url("~@/assets/1.0/images/address-pc-check-yes.png");
          }
          .text {
            max-width: 790px;
            font-size: 12px;
            color: #4d4d4d;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .is-default {
            width: 32px;
            height: 17px;
            line-height: 17px;
            text-align: center;
            border-radius: 2px;
            border: 1px solid #f4a33a;
            margin-left: 12px;
            font-size: 10px;
            font-weight: 400;
            color: #f4a33a;
          }
          .tr-btn {
            display: none;
            margin-left: auto;
            font-size: 12px;
            span {
              color: #397fe7;
              margin-right: 12px;
              cursor: pointer;
            }
          }
          &:hover {
            background: rgba(230, 31, 26, 0.06);
            .tr-btn {
              display: flex;
            }
          }
        }
      }
      .on-off {
        font-size: 12px;
        color: #999999;
        margin-top: 16px;
        margin-bottom: 42px;
        background-size: 14px 14px;
        background-position: right;
        background-repeat: no-repeat;
        width: 66px;
      }
      .open-address {
        background-image: url("~@/assets/1.0/images/address-pc-down.png");
      }
      .close-address {
        background-image: url("~@/assets/1.0/images/address-pc-up.png");
      }
    }
    .order-money {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .line {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 10px;

        h1 {
          line-height: 17px;
          color: #666666;
          white-space: nowrap;
          display: flex;
          align-items: center;
          font-size: 12px;
          b {
            font-size: 14px;
          }
          span {
            color: #e61f1a;
          }
          .discount-names {
            display: inline-block;
            max-width: 180px;
            color: #666666;
            @media screen and (max-width: 540px) {
              max-width: 1.8rem;
            }
          }
        }
        &.prepay-active {
          h1 {
            font-size: 14px;
            color: #000000;
          }
          p {
            font-size: 14px;
          }
        }
        p {
          width: 250px;
          text-align: right;
          color: #333333;
          &.money {
            color: rgba(230, 31, 26, 1);
          }
        }
        .uiSelect {
          width: 250px;
          display: flex;
          justify-content: flex-end;
        }
        @media screen and (max-width: 541px) {
          p,
          .uiSelect {
            width: 4rem;
          }
        }
        .down {
          width: 250px;
          position: relative;
          text-align: right;
          cursor: pointer;
          .disabled-span {
            color: rgba(0, 0, 0, 0.4);
          }
          .tab {
            display: inline-block;
            background: url("//static.theone.art/pc/images/pic-home/arrowright2%402x.png")
              no-repeat right center;
            background-size: 18px 18px;
            padding-right: 20px;
          }
          .wrap {
            &.choose {
              /*    background: url(~@/assets/1.0/images/arrowright2@2x.png) no-repeat
                right center;
              background-size: 18px 18px;
              padding-right: 20px; */
            }

            ul {
              display: none;
              position: absolute;
              left: 50%;
              transform: translateX(-25%);
              top: 20px;
              width: 150px;
              line-height: 30px;
              background: #ffffff;
              box-shadow: 0px 2px 6px 0px rgba(102, 102, 102, 0.26);
              border-radius: 2px;
              z-index: 99;
              li {
                height: 30px;
                text-align: center;
                color: rgba($color: #000000, $alpha: 0.4);
                cursor: pointer;
                &.active {
                  color: #000000;
                }
              }
            }
            &:hover {
              ul {
                display: block;
              }
            }
          }
        }
      }
      .pay-way {
        display: flex;
        justify-content: flex-start;
        margin: 10px 0 40px;
        @media screen and (max-width: 540px) {
          margin: 10px -10px 20px;
        }
      }
      .pay-way-list {
        display: flex;
        flex-wrap: wrap;
      }
      .pay-way-item {
        font-size: 12px;
        width: 151px;
        height: 36px;
        line-height: 36px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        margin: 10px 8px 0;
        text-align: center;
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        color: #666;
        img {
          width: 15px;
          height: 15px;
          margin-left: 5px;
        }
      }
      .warning-img {
        display: none;
      }
      .pay-way-disabled {
        background-color: #f4f4f4;
        border: 1px solid #f4f4f4;
        .warning-img {
          display: block;
        }
        &:hover {
          .pay-balance-pop {
            display: inline-block;
          }
        }
      }
      .pay-way-active {
        border: 1px solid #e61f1a;
        position: relative;
        color: #e61f1a;
        &::after {
          display: inline-block;
          content: "";
          width: 20px;
          height: 20px;
          background: url("https://static.theone.art/pc/images/icon-pay-active.png")
            no-repeat center;
          background-size: contain;
          position: absolute;
          bottom: -1px;
          right: -1px;
        }
      }
      .pay-balance-pop {
        display: none;
        position: absolute;
        top: -55px;
        left: 50%;
        white-space: nowrap;
        padding: 5px 10px 5px 16px;
        box-shadow: 0px 0px 4px 0px rgba(102, 102, 102, 0.18);
        background-color: #fff;
        z-index: 10;
        border-radius: 4px;
        &::after {
          display: inline;
          content: "";
          width: 20px;
          height: 20px;
          background: url("https://static.theone.art/pc/images/icon-pay-pop.png")
            no-repeat center;
          background-size: 20px 20px;
          position: absolute;
          bottom: -10px;
          left: 40%;
        }
      }
    }
  }
  .order-btn {
    padding: 20px 0px 0px;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    .v1-btn {
      width: 160px;
    }
    .v1-btn-link {
      margin-left: 40px;
      line-height: 40px;
    }
  }
  @media screen and (max-width: 540px) {
    .order-btn {
      justify-content: space-between;
    }
  }
  .order-update {
    padding-top: 18px;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    color: #666666;
    font-size: 14px;
    .v1-btn-link.blue {
      background: url("//static.theone.art/pc/images/pic-home/order_update.png")
        no-repeat left center;
      background-size: 14px 14px;
      padding-left: 20px;
    }
    p {
      margin-left: 15px;
      line-height: 31px;
    }
  }

  .order-message {
    color: rgba(0, 0, 0, 0.5);
    text-align: right;
    padding: 20px 0;
  }

  .order-paytime {
    padding-top: 18px;
    text-align: right;
    font-size: 12px;
    color: #666666;
    span {
      color: #e61f1a;
    }
  }
}

.arrt-panel {
  margin-bottom: 20px;
  max-width: 660px;
  &:last-child {
    margin-bottom: 0px;
  }
  &.authentication {
    .line {
      div {
        padding-right: 18px;
      }
    }
  }

  > h1 {
    font-size: 14px;
    color: #000000;
    line-height: 19px;
    margin-bottom: 8px;
  }

  .con {
    padding: 16px;
    border-radius: 4px;
    border: 1px solid #e3e3e3;
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.7);
    .line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0px;
      }
      &.hor {
        div {
          display: flex;
          justify-content: center;
        }
      }

      h1 {
        font-size: 14px;
        color: rgba($color: #000000, $alpha: 0.4);
        line-height: 20px;
      }
    }

    .v1-icon-question {
      position: relative;
      cursor: pointer;
      min-width: 80px;
      display: flex;
      align-items: center;
      margin-right: 10px;
      &:hover {
        .message {
          display: block;
        }
      }
      .message {
        transition: all 0.3s;
        display: none;
        position: absolute;
        background: #fff;
        width: 300px;
        right: 0px;
        transform: translateX(100%);
        bottom: 30px;
        padding: 20px;
        box-shadow: 0px 2px 8px 4px rgba(153, 153, 153, 0.4);
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.pay-way-line {
  .bank-tip {
    padding-right: 10px;
  }
}
@media screen and (max-width: 541px) {
  .pay-way-line {
    position: relative;
    top: 0;
    left: 0;
    .bank-tip {
      position: absolute;
      bottom: -0.4rem;
    }
  }
  .m-title {
    min-width: 1.2rem;
    padding-right: 0.1rem;
  }
  .mobile {
    display: block;
  }
  .pc-wrap {
    display: none;
  }
  .face-icon {
    display: inline-block;
    width: 0.32rem;
    height: 0.32rem;
    border-radius: 100px;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    top: 0.06rem;
  }
  .page-order-add {
    .order-info {
      box-shadow: none;
      background: transparent;
      padding: 0;

      .delivery-warp {
        display: block;
        font-weight: 400;
        color: #4d4d4d;
        border-top: 1px solid #e5e5e5;
        margin-bottom: 0.5rem;
        .label {
          font-weight: 500;
          color: #999999;
        }
        .delivery-type {
          display: flex;
          justify-content: space-between;
          padding: 0.32rem 0;
          .down {
            padding-right: 0.44rem;
            text-align: right;
            background-image: url("~@/assets/1.0/images/icon-address-down.png");
            background-repeat: no-repeat;
            background-size: 0.36rem 0.36rem;
            background-position: right;
          }
          .down-pay {
            background: none;
            padding-right: 0;
          }
        }
        .delivery-address {
          .address-user {
            padding-top: 0.16rem;
            display: flex;
            justify-content: space-between;
            .go-btn {
              font-weight: 500;
              color: #397fe7;
            }
          }
        }
      }
      .order-money {
        .line {
          justify-content: space-between;
          padding: 0.08rem 0;
          h1 {
            font-size: 0.24rem;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.4);
          }
        }
        .pay-way {
          /*    justify-content: center; */
        }
        .pay-way-item {
          width: 3rem;
          margin: 0.2rem 0.17rem 0;
        }
        .pay-balance-pop {
          top: -1.1rem;
        }
      }
      .goods-info {
        flex-direction: column;
        .cover {
          width: 100%;
          margin: 0 auto 0.2rem;
        }
        .info {
          .line {
            margin-bottom: 0.2rem;
            align-items: self-start;
            h1 {
              width: 1rem;
            }
            p {
              width: inherit;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
  .mobile-goods-info {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 0.24rem;
    margin-bottom: 0.28rem;
    .cover {
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .line-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.15rem;
    .title {
      font-size: 0.32rem;
      font-weight: 500;
      color: #000000;
    }
    .key {
      font-size: 0.24rem;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
    }
    .val {
      font-size: 0.28rem;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
    }
  }
  .page-order-add .order-btn {
    .moblie-return {
      background: #e5e5e5;
      margin-right: 0.32rem;
    }
  }
}
.consignment-content {
  ::v-deep .el-dialog__headerbtn .el-dialog__close {
    color: #909399;
  }
  @media screen and (min-width: 541px) {
    .c-html {
      max-height: 240px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
      line-height: 20px;
      overflow-y: auto;
    }
    .btn-group {
      display: flex;
      align-items: right;
      justify-content: flex-end;
      padding-top: 26px;
      .btn {
        display: inline-block;
        line-height: 30px;
        background: #e5e5e5;
        border-radius: 15px;
        font-size: 14px;
        text-align: center;
        padding: 0 36px;
        margin-left: 24px;
        cursor: pointer;
      }
      .btn-default {
        background-color: #e5e5e5;
        color: rgba(0, 0, 0, 0.7);
      }
      .btn-red {
        background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
        color: #fff;
      }
    }
  }

  @media screen and (max-width: 540px) {
    .c-html {
      max-height: 4.8rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
      line-height: 0.4rem;
      overflow-y: auto;
    }
    .btn-group {
      display: flex;
      align-items: right;
      justify-content: flex-end;
      padding-top: 0.52rem;
      .btn {
        display: inline-block;
        line-height: 0.6rem;
        background: #e5e5e5;
        border-radius: 0.3rem;
        font-size: 0.28rem;
        text-align: center;
        padding: 0 0.72rem;
        margin-left: 0.48rem;
        cursor: pointer;
      }
      .btn-default {
        background-color: #e5e5e5;
        color: rgba(0, 0, 0, 0.7);
      }
      .btn-red {
        background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
        color: #fff;
      }
    }
    .btn-group {
      justify-content: space-between;
      .btn {
        margin: 0;
        padding: 0;
        text-align: center;
        font-size: 0.28rem;
        flex: 1;
      }

      .btn-default {
        margin-right: 10px;
      }
      .btn-red {
      }
    }
  }
}
@media screen and (min-width: 541px) {
  .delivery-warp {
    display: none !important;
  }
  .delivery-pc,
  .address-pc {
    display: block !important;
  }
  ::v-deep .el-dialog {
    width: 572px !important;
  }
}
@media screen and (max-width: 540px) {
  .delivery-warp {
    display: block !important;
  }
  .delivery-pc,
  .address-pc {
    display: none !important;
  }
  ::v-deep .el-dialog {
    width: 90% !important;
  }
}
</style>
