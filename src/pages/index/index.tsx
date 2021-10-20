import { useCallback, useEffect, useState } from "react";
import { View, Button, ScrollView, Input } from "@tarojs/components";
import { useStorage } from "taro-hooks";
import {
  AtButton,
  AtCard,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtInputNumber,
  AtInput
} from "taro-ui";
import Taro from "@tarojs/taro";
import "./index.scss";
import { ILottery, ILotteryResponse } from "./type";
import useOpen from "../../hooks/useOpen";
import { checkWinNum, classnames, getRandomNumbers } from "./utils";
import useRandomNumbers from "./useRandomNumbers";

const PREFIX = "lottery";

const Index = () => {
  const [list, setList] = useState<ILottery[]>();
  const { isOpened, onOpen, onClose } = useOpen();
  const latestLotteryDrawNum = list?.[0]?.lotteryDrawNum || "";
  const nextLotteryDrawNum = parseInt(latestLotteryDrawNum) + 1 + "";
  const [storageInfo, { set, get, remove }] = useStorage();
  const { randomNumbers, setRandomNumbers } = useRandomNumbers();

  useEffect(() => {
    onGetWinNumList();
  }, [])

  const onGetWinNumList = async () => {
    return Taro.request({
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

  const myNumberList = Object.entries(
    storageInfo.storage
  ).filter(([key, value]) => key.startsWith(PREFIX));

  return (
    <View className="wrapper">
      <View className="btn-box">
        <AtButton onClick={onGetWinNumList} type="secondary">
          Refresh
        </AtButton>
        <AtButton
          onClick={async () => {
            if (!!latestLotteryDrawNum) {
              onOpen();
            } else {
              await onGetWinNumList()
              onOpen();
            }
          }}
          type="primary"
        >
          Select
        </AtButton>
      </View>
      <AtModal isOpened={isOpened} closeOnClickOverlay={false}>
        <AtModalHeader>{nextLotteryDrawNum}</AtModalHeader>
        <AtModalContent>
          <View>
            <AtInput
              name="123"
              onChange={value => {
                setRandomNumbers((value + "")?.split(" "));
              }}
              value={randomNumbers.join(" ")}
            />
          </View>
        </AtModalContent>
        <AtModalAction>
          {" "}
          <Button onClick={onClose}>取消</Button>{" "}
          <Button
            onClick={() => {
              const data = [randomNumbers.join("-")];
              const key = `${PREFIX}-${nextLotteryDrawNum}`;
              get(key)
                .then(res => {
                  set(key, [...res, ...data]);
                })
                .catch(() => {
                  set(key, [...data]);
                });
              onClose();
            }}
          >
            确定
          </Button>{" "}
        </AtModalAction>
      </AtModal>
      <ScrollView>
        {myNumberList?.map(item => {
          const lotteryDrawNum = item[0]?.split("-")[1];
          const cur = list?.find(
            item => item.lotteryDrawNum === lotteryDrawNum
          );

          const lotteryDrawTime = cur?.lotteryDrawTime;
          const lotteryDrawResult = cur?.lotteryDrawResult;
          const lotteryDrawResultArr = lotteryDrawResult
            ?.split(" ")
            .filter(item => !!item)
            ?.map(item => parseInt(item));
          return (
            <AtCard
              extra={lotteryDrawTime}
              title={lotteryDrawNum}
              note={lotteryDrawResult}
            >
              {item[1]?.map(str => {
                const nums = str.split("-")?.map(item => parseInt(item));
                return (
                  <View className="ball-box">
                    {nums?.map((num, index) => {
                      const classes = classnames("ball", {
                        "ball--active": checkWinNum(
                          lotteryDrawResultArr,
                          nums,
                          index
                        )
                      });
                      return <View className={classes}>{num}</View>;
                    })}
                  </View>
                );
              })}
            </AtCard>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Index;
