import React, {Component, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Button, Card, Cascader, Select, Spin, List, message, Row, Col, Avatar, Icon, Typography, Statistic} from 'antd';
import options from "./City";
import moment from "moment";
const { Countdown } = Statistic;
const { Option } = Select;
const { Meta } = Card;
const { Text } = Typography;
var request = require('request');

//计算时间差并转换成标准时间单位
// @ts-ignore
message.success(moment("2020-01-22").format('x') - moment().format('x'));

export default function App() {
    const [count, setCount] = useState(0);
    const [cascader, setCascader] = useState(["浙江省", "宁波市", "鄞州区"]);
    const [queryStr, setQueryStr] = useState(undefined);
    const [dataList, setDataList] = useState([]);
    const [doQuery, setDoQuery] = useState(true);
    const [targetId, setTargetId] = useState("330212");
    useEffect(() => {
        if (doQuery) {
            setDoQuery(false);
            request(`http://rest.yining.site:8088/v1/auction_item/?query=auction_target_id%3A%20${targetId}&limit=100&offset=1&sortby=update_time&order=asc`, function (error: any, response: { statusCode: any; }, body: any) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.
                if (body !== "null"){
                    setDataList(JSON.parse(body));
                }
                else {
                    setDataList([]);
                }
            });
        }
    });
    return (
        <div className="App">
            <header className="App-header">
                <Row type="flex" justify="center" gutter={[32, 32]}>
                    <Col span={24}>
                        <div>
                            城市选择：<Cascader style={{width: '50%'}} value={cascader} options={options}
                                           onChange={(value, selectedOptions) =>{
                                               setCascader(value);


                                               const cityName = value[value.length-1];
                                               const len = value.length;
                                               try {
                                                   let pIndex = 0;
                                                   let cIndex = 0;
                                                   options.filter(((vv, ind) => {
                                                       if (JSON.stringify(vv).indexOf(cityName) > 0){
                                                           pIndex = ind;
                                                       }}));
                                                    if (len == 2) {
                                                        // @ts-ignore
                                                        options[pIndex].children.filter((v, i) => {
                                                            if (JSON.stringify(v).indexOf(cityName) > 0){
                                                                cIndex = i;
                                                                setTargetId(v.code);
                                                                console.log(`${cityName} 城市code: ${v.code}`);
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        // @ts-ignore
                                                        options[pIndex].children.filter((v, i) => {
                                                            if (JSON.stringify(v).indexOf(cityName) > 0){
                                                                cIndex = i;
                                                                console.log(`${cityName} 城市code: ${v.code}`);
                                                                setTargetId(v.code);
                                                            }
                                                        });
                                                        // @ts-ignore
                                                        options[pIndex].children[cIndex].children.filter((v, i) => {
                                                            if (JSON.stringify(v).indexOf(cityName) > 0){
                                                                console.log(`${cityName} 城市code: ${v.code}`);
                                                                setTargetId(v.code);
                                                            }
                                                        });
                                                    }
                                                   // options.map((value, index) => {
                                                   //     try{
                                                   //         const fuck = value.children;
                                                   //
                                                   //         if (len === 2){
                                                   //             // @ts-ignore
                                                   //             const aa = fuck.filter(fc => fc.value === cityName);
                                                   //             if (aa.length > 0) {
                                                   //                 console.log(JSON.stringify(aa));
                                                   //                 message.success(aa[0]["code"]);
                                                   //
                                                   //             }
                                                   //         }
                                                   //         else {
                                                   //             // @ts-ignore
                                                   //             const bb = fuck.children.filter(fc => fc.value === cityName);
                                                   //             if (bb !== undefined) {
                                                   //                 message.success(`num33333 ${bb[0].code}`);
                                                   //             }
                                                   //         }
                                                   //     }
                                                   //     catch (e) {
                                                   //
                                                   //     }
                                                   //
                                                   // }); //filter(v => v.children.filter(vc => vc.value === cityName));
                                               } catch (e) {
                                                   console.error(e);
                                               }

                                           }} changeOnSelect
                                           placeholder="选择城市"
                                           />
                            <Button style={{marginLeft: 20, height: 50, width: 50}} onClick={(v) => {
                                setDoQuery(true);
                            }} className="App-logo" type="primary" shape="circle" icon="search"/>
                        </div>
                    </Col>

                    <Col span={24}>
                        <List
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 4,
                                lg: 4,
                                xl: 6,
                                xxl: 6,
                            }}
                            dataSource={dataList}
                            renderItem={item => (
                                <List.Item>
                                    <Card
                                        title={item["Title"]}
                                        hoverable
                                        cover={<img alt="example" src={item["PicUrl"]}
                                        onClick={(v) => {
                                            // @ts-ignore
                                            window.open("about:blank").location.href = item["ItemUrl"]
                                        }}/>}
                                    >
                                        <Meta style={{height: "65px"}} description={item["Title"]}/>
                                        {
                                            // @ts-ignore
                                            // (moment(item["End"]).format('x') - moment().format('x')) < 0 ?

                                        }
                                        <Text delete><Statistic title="起拍价" valueStyle={{ color: '#3f8600' }} value={item["InitialPrice"]} prefix={"¥"} precision={2} /></Text>
                                        {
                                            item["ConsultPrice"] !== 0 ? <Statistic valueStyle={{fontSize: "15px"}} value={item["ConsultPrice"]} prefix={"评估价: ¥"} precision={2} />
                                                : item["MarketPrice"] !== 0 ? <Statistic valueStyle={{ fontSize: "15px" }} value={item["MarketPrice"]} prefix={"市场价: ¥"} precision={2} />
                                                : <Statistic valueStyle={{fontSize: "15px"}} value={item["InitialPrice"]} prefix={"评估价: ¥"} precision={2} />
                                        }
                                        {
                                            // @ts-ignore
                                            (moment(item["Start"]).format('x') - moment().format('x')) < 0 ?  <Countdown valueStyle={{ fontSize: "15px" }}  value={item["End"]} format="距结束: D 天 H 时 m 分 s 秒" /> : <Countdown valueStyle={{ fontSize: "15px" }}  value={item["Start"]} format="距开始: D 天 H 时 m 分 s 秒" />
                                        }


                                    </Card>
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </header>
        </div>
    );
}
