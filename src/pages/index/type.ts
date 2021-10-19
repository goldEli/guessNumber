export interface ILotteryResponse {
  success: boolean;
  value: {
    list: ILottery[]
  };
}

export interface ILottery {
/**中奖号码 "01 02 09 16 30 09 10"*/
lotteryDrawResult: string
/**期号 */
lotteryDrawNum: string
/**开奖日期 */
lotteryDrawTime: string
}