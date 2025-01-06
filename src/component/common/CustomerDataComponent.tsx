import styled from '@emotion/styled';
import { useMutation, useQueryClient } from "react-query";
import axios from "@/pages/api/axios"; //api 주소랑 연동
import { AxiosResponse } from 'axios';
import React, {  useState } from 'react';
import CustomerDetailComponent from './CustomerDetailComponent';

interface CustomerComponentProps{
   data: any[];
   setData: React.Dispatch<React.SetStateAction<any>>;
}

const StyleBox = styled.div`
.custom-list{
   width:1000px;
   height:650px;
   //background-color:gray;
   float:left;
   margin-right:10px;
   padding:10px;
 }
 .custom-list p{
   margin-bottom:10px;
   font-weight:bold;
 }
 .table-wrap{
   height:606px;
   //background-color:gray;
   overflow:auto;
   border:1px solid black;
 }
table{
   width:100%;
   //height:600px;
}
#tr-head th{
   position: sticky;
   top: 0px;
   background-color:lightgray;
   border:1px solid black;
   height:35px;
}
.tbody {
   overflow-y: auto;
}   
.tbody tr{
   height:40px;
   table-layout:fixed;
   cursor:pointer;
 }
 .tbody th:first-child, .thead th:first-child{
   width:50px;
 }
 .tbody th:nth-child(2), .thead th:nth-child(2){
   width:150px;
 }
 .tbody th:nth-child(3), .thead th:nth-child(3){
   width:300px;
 }
 .tbody th:nth-child(4), .thead th:nth-child(4){
   width:150px;
 }
 .tbody th:nth-child(5), .thead th:nth-child(5){
   width:150px;
 }
 .tbody th:nth-child(6), .thead th:nth-child(6){
   width:150px;
 }
 table th{
   border:1px solid black;
 }

`

const CustomerData = ({data, setData}:CustomerComponentProps) => {
const [calCodeData, setCalCodeData] = useState<any>([]);  //고객사 상세정보
const [selectedRow, setSelectedRow] = useState<any>(null); //row selected

// 고객사 상세정보 조회 api, object형식 custCd:고객사코드
const customerCall = (custCd:string) => {
  fetch('http://133.186.221.46:8090/test/api/search/customer/detail',{
      method:'post',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({
      //   custNm:null,  //고객사명
      //   regionCd:null, //지역코드
      //   calCd:null,   //정산방법 
      //   useYn:null,   //사용여부
      // }),
      body: JSON.stringify({
        custCd:custCd,  //고객사명
      }),
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      setCalCodeData(data.data);
      setSelectedRow(custCd);
    })
}


 const onCheckedItem = (custCd: any, useYn: any) => {
   console.log(custCd)
   console.log(useYn)
   const updatedUseYn = useYn === '1' ? '2' : '1';
   // find 함수를 사용하여 특정 항목을 찾습니다.
   let findData = data.find((e: any) => e.custCd == custCd);
   console.log(findData);
   findData = {...findData, useYn:updatedUseYn}
   console.log(findData);
   const updatedItems  = data.map((item:any) => (item.custCd === custCd ? findData:item))
   setData(updatedItems)
 }

 return (
    <>
    <StyleBox>
         <div className='custom-list'>
         <p>고객사 목록</p>
         <div className='table-wrap'>
              <table className='table'>
                <thead className='thead'>
                  <tr className='tr' id='tr-head'>
                    <th></th>
                    <th>고객사코드</th>
                    <th>고객사명</th>
                    <th>지역</th>
                    <th>정산방법</th>
                    <th>사용여부</th>
                  </tr>
                </thead>
                <tbody className='tbody'>
                  {data.map((item:any, index:number) => (
                    <tr onClick={() => {customerCall(item.custCd)}}  style={{ backgroundColor: selectedRow == item.custCd ? 'lightyellow' : 'inherit' }}>
                        <th>{index + 1}</th>
                        <th>{item.custCd}</th>
                        <th style={{'textAlign':'justify', 'padding':5}}>{item.custNm}</th>
                        <th>{item.regionCd === '1' ? '도내' : (item.regionCd === '2' ? '도외' : '기타')}</th>
                        <th>{item.calCd === '1' ? '고산농협' : (item.calCd === '2' ? '직접정산':'기타')}</th>
                        <th><input type='checkbox' name={item.useYn}  value='useYn' checked={item.useYn === '1'}
                         onChange={()=>onCheckedItem(item.custCd, item.useYn)} className='checkbox' /></th>
                    </tr> 
                    ))}
                </tbody>
              </table>
              </div>
         </div>
         <CustomerDetailComponent 
         calCodeData={calCodeData} 
         setCalCodeData={setCalCodeData}
         data={data}
         setData={setData}
         />
 
    </StyleBox>
  
 </>
 )
}

export default CustomerData;