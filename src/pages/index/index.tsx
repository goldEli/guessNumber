import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import { useEnv, useNavigationBar, useModal, useToast } from "taro-hooks";
import { AtButton, AtCard } from "taro-ui";
import Taro, { stopPullDownRefresh, usePullDownRefresh } from "@tarojs/taro";
import "./index.scss";
import { ILottery, ILotteryResponse } from "./type";

const data: {
  time?: string;
  myNumber: number[];
  winningNumber?: number[];
}[] = [
  {
    time: "2021",
    myNumber: [12, 23, 43, 2, 4, 2]
  },
  {
    time: "2021",
    myNumber: [12, 23, 43, 2, 4, 2],
    winningNumber: [12, 23, 43, 2, 4, 2]
  },
  {
    time: "2021",
    myNumber: [12, 23, 43, 2, 4, 2],
    winningNumber: [12, 23, 43, 2, 4, 2]
  },
  {
    time: "2021",
    myNumber: [12, 23, 43, 2, 4, 2],
    winningNumber: [12, 23, 43, 2, 4, 2]
  },
  {
    time: "2021",
    myNumber: [12, 23, 43, 2, 4, 2],
    winningNumber: [12, 23, 43, 2, 4, 2]
  },
  {
    time: "2021",
    myNumber: [12, 23, 43, 2, 4, 2],
    winningNumber: [12, 23, 43, 2, 4, 2]
  },
  {
    time: "2021",
    myNumber: [12, 23, 43, 2, 4, 2],
    winningNumber: [12, 23, 43, 2, 4, 2]
  },
  {
    time: "2021",
    myNumber: [12, 23, 43, 2, 4, 2],
    winningNumber: [12, 23, 43, 2, 4, 2]
  },
  {
    time: "2021",
    myNumber: [12, 23, 43, 2, 4, 2],
    winningNumber: [12, 23, 43, 2, 4, 2]
  }
];

const Index = () => {
  const [list, setList] = useState<ILottery[]>();

  useEffect(() => {
    onGetWinNumList();
  }, []);

  usePullDownRefresh(() => {
    onGetWinNumList();
    stopPullDownRefresh();
  });

  const onGetWinNumList = () => {
    Taro.request({
      url:
        "https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=85&provinceId=0&pageSize=30&isVerify=1&pageNo=1", //仅为示例，并非真实的接口地址
      success: function(res) {
        console.log(res.data);
        const data = res.data as ILotteryResponse;
        if (data.success) {
          setList(data.value.list);
        }
      }
    });
  };

  return (
    <View className="wrapper">
      <View className="btn">
        <AtButton type="primary">Select</AtButton>
      </View>
      <ScrollView>
        {list?.map(item => {
          return (
            <AtCard
              extra={item.lotteryDrawTime}
              title={item.lotteryDrawNum}
              note={item?.lotteryDrawResult}
            >
              {/* <View>
                <Text>已选：</Text>
                {item.myNumber.map(item => {
                  return <Text>{item} </Text>;
                })}
              </View> */}
              {/* <View>
                <Text>WN：</Text>
                {item?.lotteryDrawResult.split('\n')?.map(item => {
                  return <Text>{item} </Text>;
                })}
              </View> */}
            </AtCard>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Index;
