import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useDaumPostcodePopup } from "react-daum-postcode";
import { postcodeScriptUrl } from "react-daum-postcode/lib/loadPostcode";
import DaumPostcode from 'react-daum-postcode';
import { useMutation, useQueryClient } from "react-query";
import { AxiosPromise, AxiosResponse } from 'axios';
import ReactDOM from 'react-dom';
import Item from 'antd/es/list/Item';
import { useRouter } from 'next/router';
import axios from "@/pages/api/axios"; //api 주소랑 연동
import CustomerDataComponent from '@/component/common/CustomerDataComponent';
import { chownSync } from 'fs';
import { error } from 'console';

const MainBox= styled.div`
  .main{
    width:1800px;
    height:900px;
    border:1px solid black;
    background-color:white;
    margin:20px auto;
    padding:20px;
    position:relative;
  }
  .top{
    width:100%;
    height:50px;
    border-bottom:3px solid gray;
    position:relative;
    //background-color:purple; 
  }
  h3{
    float:left;
    line-height:40px;
  }

  .Log-in{
    width:130px;
    height:40px;
    position:absolute;
    right:50px;
  }
  .Log-in img{
    width:40px;
    height:40px;
    float:left;
    margin-right:10px;
  }
  .Log-in p{
    line-height:40px;
  }
  .Log-out{
    width:25px;
    height:25px;
    float:right;
    margin-top:8px;
    cursor:pointer;
  }
  .menu-bar{
    width:100%;
    height:50px;
    border-bottom:1px solid gray;
    position:relative;
  }
  .hamburger{
    width:30px;
    height:30px;
    //background-color:black;
    float:left;
    margin-top:10px;
    margin-right:10px;
    cursor:pointer;
    position:relative;  z-index:10;
  }
  .hamburger span,
  .hamburger span:before,
  .hamburger span:after{
    display:block;
    position:absolute;
    left:0;
    width:100%;
    height:3px;
    background-color:black;
  }
  .hamburger span{
    top:50%;
    transform:translateY(-50%, -50%);
  }
  .hamburger span:before,
  .hamburger span:after{
    content:'';
  }
  .hamburger span:before{
    top:-10px;
  }
  .hamburger span:after{
    top:10px;
  }
  .menu-bar p{
    line-height:50px;
    float:left;
  }
  .menu p{
    width:100%;
    height:20px;
    text-align:center;
    margin-top:150px;
  }
  .menu{
    position: absolute;
    top: -70px;
    left: -20px;
    height: 900px;
    //transition: 0.5s ease;
    max-width: 0;
    z-index:9;
    background-color:#dcdcdc;
    overflow: hidden;
  }
  .hamburger-wrap{
    width:30px;
    float:left;
    height:50px;
  }
  .burger-icon {
    cursor: pointer;
    display: inline-block;
    position: absolute;
    z-index: 10;
    padding: 8px 0;
    top: 4px;
    left: 4px;
    user-select: none;
    width: 30px;
    height:30px;
    margin: 0;
    float:left;
    margin-top:10px;
  }
  .burger-icon .burger-sticks {
    background: #333;
    display: block;
    height: 3px;
    position: relative;
    transition: background .2s ease-out;
    width: 18px;
  }
  .burger-icon .burger-sticks:before,
  .burger-icon .burger-sticks:after {
    background: #333;
    content: '';
    display: block;
    height: 100%;
    position: absolute;
    transition: all .2s ease-out;
    width: 100%;
  }

  .burger-icon .burger-sticks:before {
    top: 6px;
  }

  .burger-icon .burger-sticks:after {
    top: -6px;
  }
  .button-wrap{
    width:210px;
    height:30px;
    //background-color:pink;
    float:right;
    margin-top:15px;
  }
  .burger-check {
    display: none;
  }
  
  .burger-check:checked~.menu {
    max-width: 400px;
    transition: 0.5s ease;
  }
  
.burger-check:checked~.burger-icon .burger-sticks {
  background: transparent;
}

.burger-check:checked~.burger-icon .burger-sticks:before {
  transform: rotate(-45deg);
}

.burger-check:checked~.burger-icon .burger-sticks:after {
  transform: rotate(45deg);
}

.burger-check:checked~.burger-icon:not(.steps) .burger-sticks:before,
.burger-check:checked~.burger-icon:not(.steps) .burger-sticks:after {
  top: 0;
}

  .manage{
    float:left;
  }

  .btn1,
  .btn2{
    width:100px;
    float:left;
    border:1px solid gray;
  }
  .btn1{
    margin-right:10px;
  }
  .select-wrap{
    width:100%;
    height:80px;
    background-color:lightgray;
    position:relative;
    margin:10px auto;
  }
  .select{
    width:439.5px;
    height:100%;
    background-color:#f5f5f5;
    float:left;
    //border-right:1px solid black;
  }
  .select p{
    width:180px;
    float:left;
    line-height:80px;
    text-align:center;
    letter-spacing:10px;
    font-weight:bold;
  }
  .select-detail{
    width:230px;
    height:40px;
    float:left;
    margin-top:20px;
    border:1px solid black;
    cursor:pointer;
  }
  .p3{
    width:230px;
    height:40px;
    margin-top:20px;
    border:1px solid black;
  }

`;

interface CustomerDetailInfo{
  custCd:string;		
  custNm:string;				
  regionCd:string;				
  calCd:string;				
  shipmentYn:string;				
  telNo:string;
  faxNo:string;
  postNo:string;
  addStd:string;
  addDtl:string;
  manNm:string;
  manTelNo:string;
  invoiceMail:string;
}

// 고객사 목록조회
// interface LangType{
//   custNm:null;  //고객사명
//   regionCd:null; //지역코드
//   calCd:null;   //정산방법 
//   useYn:null;   //사용여부
// }
 
const Main = () => {
  const router = useRouter();
  //const queryClient = useQueryClient(); 
  const [regionCd, setRegionCd] = useState<any>([]);  //지역코드
  const [calCd, setCalCd] = useState<any>([]); //정산방법
  const [useYn, setUseYn] = useState<any>([]);  //사용여부
  const [data, setData] = useState<any>([]);  // 고객사 목록조회
  const [searchData, setSearchData] =useState<any>({  //고객사 전체목록 조회
  regionCd: null, // 지역코드
  calCd: null,    // 정산방법 
  custNm: null,   // 고객사명
  useYn: null,    // 사용여부
  })
  const [calCodeData, setCalCodeData] = useState<any>([]);  //고객사 상세정보
  const [selectedRow, setSelectedRow] = useState<any>(null);


// // 다음 우편번호 url
// // useDaumPostcodePopup(postcodeScriptUrl)을 호출하여 open이라는 함수를 생성한다.
const open = useDaumPostcodePopup(postcodeScriptUrl);

// // 클릭 시 수행될 팝업 생성 함수
// // 주소검색이 완료되고, 결과 주소를 클릭 시 해당 함수 실행 
// // open함수로 주소 검색팝업 열고 검색완료시 handleComplete실행
const handleClick = () => {
  open({onComplete: handleComplete}); 
}

const handleComplete = (data: any) => {
  console.log(data);
  // postNo: 우편번호 id값, addStd: 기본주소 id값
  // 현재 calCodeData 상태를 업데이트
  // 도로명주소/지번주소 조건문
  if(data.userSelectedType === 'R'){
    console.log(data.userSelectedType);
    setCalCodeData({...calCodeData, postNo: data.zonecode, addStd: data.roadAddress});
  }else{
    console.log(data.userSelectedType);
  setCalCodeData({...calCodeData, postNo: data.zonecode, addStd: data.jibunAddress});
  }
}


//공통코드 api
// const commonData = async () => {
//    const res = await axios.post('/test/api/commonCode', { comCd: "REGION_CD" });
//     setRegionCd(res.data.data);
//     const cal = await axios.post('/test/api/commonCode', { comCd: "CAL_CD" });
//     setCalCd(cal.data.data);
//     const use = await axios.post('/test/api/commonCode', { comCd: "USE_YN" });
//     setUseYn(use.data.data);
// }
//   useEffect(() => {
//     console.log('aaaa');
//     //commonData();
// }, []);


// 전체 고객사목록 조회버튼
// const cacheHandler =  () => {
//   handleCallApi(searchData);
//   console.log(searchData)
// };
// const handleCallApi = async (param:LangType) => {
//   try {
//     const response = await mutation_2.mutateAsync(param);
//     setData(response.data.data);
//   } catch (error) {
//     console.error("Q", error);
//   }
// };

// // 고객사 목록 조회(고객사명, 지역코드, 정산방법코드, 사용여부) api, list형식
// const mutation_2 = useMutation(
//   (param : LangType) => axios.post("/test/api/search/customer", param),
//   {
//     onSuccess:(response:AxiosResponse) => {
//       queryClient.invalidateQueries(["getData"]);
//       console.log("API 호출 성공:", response.data); 
//     },
//   }
// );



// const mutation_3 = useMutation(
//   (param:any) => axios.post('/test/api/save/custUseYn',{'data': param}),
//   {
//     onSuccess:(response:AxiosResponse) => {
//       queryClient.invalidateQueries(["getData"]);
//       console.log("API 호출 성공:", response.data); 
//     },
//   }
// )

// const saveHandler= async () =>{
//   try {
//     const response = await mutation_3.mutateAsync(data);
//     console.log(response.data);
//     customerSearch({
//       calCd: null,  
//       custNm: null,
//       regionCd: null,
//       useYn: null,
//     });
//   } catch (error) {
//     console.error("Q", error);
//   }

// }




// // 고객사 상세정보 조회 api, object형식 custCd:고객사코드
// const mutation_4 = useMutation(
//   (param:any) => axios.post('/test/api/search/customer/detail',{'custCd' : param}),
//   {
//     onSuccess:(response:AxiosResponse) => {
//       queryClient.invalidateQueries(["getData"]);
//       console.log("API 호출 성공:", response.data); 
//     },
//   }
// )

// const customerCall = async (custCd:string) => { 
//   try {
//     const response = await mutation_4.mutateAsync(custCd);
//     setCalCodeData(response.data.data);
//     setSelectedRow(custCd);
//   } catch (error) {
//     console.error("Q", error);
//   }
// }





  
  // 공통코드 api 호출(지역)
  useEffect(() => {
    fetch('http://133.186.221.46:8090/test/api/commonCode',{
    method:'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      comCd: "REGION_CD",
    }),
    })
    .then((res) => res.json())
    .then((data) => {
      setRegionCd(data.data);
      console.log(Array.isArray(data.data)); //data가 배열인지 확인하는 방법
      //console.log(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  },[]);  //빈 배열을 전달하여 컴포넌트가 마운트될 때만 실행
  

  // 공통코드 api 호출(정산방법)
  useEffect(() => {
    fetch('http://133.186.221.46:8090/test/api/commonCode',{
    method:'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      comCd: "CAL_CD",
    }),
    })
    // .then((res) => {
    //   return res.json();
    // })
    .then((res) => res.json())
    .then((data) => {
      setCalCd(data.data);
    });
  },[]);


  // 공통코드 api 호출(사용여부)
useEffect(() => {
  fetch('http://133.186.221.46:8090/test/api/commonCode',{
    method:'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      comCd: "USE_YN",
    }),
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    //console.log(data);
    setUseYn(data.data);
  })
},[]);

const cacheHandler = () => {
  console.log('search ::: ', searchData);
  customerSearch(searchData);
}

// 전체 고객사목록 조회버튼
const customerSearch = (searchData: any) => {
  alert('조회되었습니다.')
    fetch('http://133.186.221.46:8090/test/api/search/customer',{
      method:'post',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({
      //   custNm:null,  //고객사명
      //   regionCd:null, //지역코드
      //   calCd:null,   //정산방법 
      //   useYn:null,   //사용여부
      // }),
      body: JSON.stringify(searchData),
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      //console.log(data);
      setData(data.data);
    })
}

// 지역, 정산방법, 고객사명, 사용여부 option 조회
const optionHandler = (e:any) => {
  const inputValue = e.target.value === ''? null:e.target.value;
  setSearchData({...searchData, [e.target.name]: inputValue});
}
//console.log(searchData);


const saveHandler = () => {
  alert('사용여부가 저장되었습니다.');
  fetch('http://133.186.221.46:8090/test/api/save/custUseYn', {
  method:'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(customerSearch)
})
.then((res) => {
  return res.json();
})
.then((data) => {
  console.log(data);
})
}

// 나가기 버튼
const handleLogoutClick = () => {
  //window.location.href= '/close';
  alert('로그아웃되었습니다.')
  router.push('/close');
}





// // 고객사 정보 저장 (saveType:1 신규등록, saveType:2 수정), object형식
// const mutation_5 = useMutation(
//   (param:CustomerDetailInfo) => axios.post('/test/api/save/customer', param),
//   {
//     onSuccess:(response:AxiosResponse) => {
//       queryClient.invalidateQueries(["getData"]);
//       console.log("API 호출 성공:", response.data); 
//     },
//   }
// )

// 수정/신규저장버튼
// const saveSubHandler = async (e:any) => {
//   console.log("ca", calCodeData)  //고객사 상세정보

//   try {
//     const previousCalCodeData = {...calCodeData, saveType:calCodeData.custCd == '' ? 1 : 2 };
//     const response = await mutation_5.mutateAsync(previousCalCodeData);
//     console.log("saveSub", response.data.data);
//     setSelectedRow(response.data.data);
//     const a = response.data.data
//     // handleCallApi({ //고객사 목록조회
//     //   //custCd: "",
//     //   calCd: null,
//     //   custNm: null,
//     //   regionCd: null,
//     //   useYn: null,
//     // });
    
//     const selectData = data.find((item:any) => item.custCd == a.data);
//     console.log("selectedRow", selectedRow)
//     console.log(calCodeData)
//     console.log(selectData)
//     if(previousCalCodeData.saveType === 1){
//       console.log(calCodeData)
//       alert('새로 추가되었습니다.');
//     } else {
//       alert('수정이 완료 되었습니다');
//     }
//   } catch (error) {
//     console.error("Q", error);
//   }
// };


// const onChanged =(event:{target:any;}) => {
//   const colName = event.target.id == "" ? event.target.className : event.target.id;
//   console.log(event.target.id );
//   console.log(colName);
//   setCalCodeData({...calCodeData, [colName]: event.target.value,});
//   console.log(calCodeData);
// }



//======================
function checkReg(event:{target:any;}){
  event.target.value = event.target.value.replace(/[^ㄱ-ㅎ가-힣a-zA-Z\s]/g, "");
}

function autoHyphen(event: { target: any; }){
  event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/(\d{3})(\d{4})(\d)/, "$1-$2-$3");
}

function autoFax(event:{target:any;}){
  event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/(\d{2})(\d{4})(\d{4})/,'$1-$2-$3');
}
//======================





// const onCheckedItem = (custCd: any, useYn: any) => {
//   console.log(custCd)
//   console.log(useYn)
//   const updatedUseYn = useYn === '1' ? '2' : '1';
//   // find 함수를 사용하여 특정 항목을 찾습니다.
//   let findData = data.find((e: any) => e.custCd == custCd);
//   console.log(findData);
//   findData = {...findData, useYn:updatedUseYn}
//   console.log(findData);
//   const updatedItems  = data.map((item:any) => (item.custCd === custCd ? findData:item))
//   setData(updatedItems)
// }

const addHandler = () => {
  setSelectedRow(null)
  const init = {
    custCd:'',	
    custNm:'',				
    regionCd:'',				
    calCd:'',				
    shipmentYn:'Y',				
    telNo:'',
    faxNo:'',
    postNo:'',
    addStd:'',
    addDtl:'',
    manNm:'',
    manTelNo:'',
    invoiceMail:'',
    useYn:'1',
  }
  setCalCodeData(init);
}





  return (
    <>
      <MainBox>
        <div className='main'>
          <div className='top'>
            <h3>비즈위즈시스템</h3>
            <div className='Log-in'>
              <img src={'/img/member.png'}/>
              <p>강은자</p>
            </div>
            <div className='Log-out' onClick={handleLogoutClick}>
              <img src={'/img/close.png'} />
            </div>
          </div>
          <div className='menu-bar'>
            <div className='hamburger-wrap'>
              <input className="burger-check" type='checkbox' id='burger-check'/>
              <label htmlFor='burger-check' className='burger-icon'>
                <span className='burger-sticks'></span>
              </label>
            
            <div className='menu'>
              <div style={{width:200}}>
                <p>고객사 관리</p>
              </div>
            </div>
            </div>
            <p className='manage'>고객사 관리</p>
            <div className='button-wrap'>
              <button className='btn1' onClick={()=> cacheHandler()}>조회</button>
              <button className='btn2' onClick={()=> saveHandler()}>저장</button>
            </div>
          </div>
          <div className='select-wrap'>
            
            <div className='select'>
              <p className='select-test'>지역</p>
              <select className='select-detail' name="regionCd" onChange={(e) => optionHandler(e)}>
                <option value={''}>전체</option>
                {regionCd.map((o:any)=> (
                   <option  key={o.typeCd} value={o.typeCd}>{o.typeNm}</option>
                ))} 
              </select>
            </div>

            <div className='select'>
              <p>정산방법</p>
              <select className='select-detail' name="calCd" onChange={(e) => optionHandler(e)}>
                <option value={''}>전체</option>
                {calCd.map((o:any)=> (  
                   <option key={o.typeCd} value={o.typeCd}>{o.typeNm}</option>        
                ))}
              </select>
            </div>
        
            <div className='select'>
              <p>고객사명</p>
              <input type='text' name='custNm' className='p3' onChange={(e) => optionHandler(e)}/>
            </div>
      
            <div className='select'>
              <p>사용여부</p>
              <select className='select-detail' name="useYn" onChange={(e) => optionHandler(e)}>
                <option value={''}>전체</option>
                {useYn.map((o:any)=> (
                  <option key={o.typeCd} value={o.typeCd}>{o.typeNm}</option>
                ))}
              </select>
            </div>
          </div>
         <div className='bottom-wrap' style={{ width: '100%', height: '650px' }}>
         <CustomerDataComponent data = {data} setData = {setData} />
         </div>
            
          {/* <div className='bottom-wrap'>
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

            <div className='custom-detail'>
              <div className='custom-button'> 
                <p>고객사 상세정보</p>
                <button onClick={() => addHandler()}><img src={'/img/plus_button.png'} /></button>
                <button onClick={(e)=> saveSubHandler(e)}><img src={'/img/save.png'} /></button>
              </div>
              <div className='detail-wrap'>
                <div className='detail-list'>
                  <p className='p1'>고객사코드</p>
                  <input type='text' id='custCd' value={calCodeData.custCd} disabled ></input>
                </div>
                <div className='detail-list'>
                  <p className='p4'>고객사명</p>
                  <input type='text' id='custNm' onChange={(e)=>onChanged(e)} maxLength={10} onInput={checkReg} value={calCodeData.custNm}></input>
                </div>
                <div className='detail-list'>
                  <p className='p2'>지역</p>
                   <select className='regionCd' value={calCodeData.regionCd}  onChange={(e)=>onChanged(e)}>
                   <option value={""}>기타</option>
                   {regionCd.filter((o:any) => o.typeCd ==1 || o.typeCd == 2).map((o: any) => {
                    console.log(o.typeCd, o.typeNm);
                    return <option value={o.typeCd}>{o.typeNm}</option>
                   })}
                   </select> 
                </div>
                <div className='detail-list'>
                  <p className='p4'>정산방법</p>
                  <select className='calCd' value={calCodeData.calCd}  onChange={(e)=>onChanged(e)}>
                  <option value={""}>기타</option>
                  {calCd.filter((o:any) => o.typeCd == 1 || o.typeCd == 2).map((o:any)=> {
                    return <option value={o.typeCd}>{o.typeNm}</option>
                  })}
                  </select>
                </div>
                <div className='detail-list'>
                  <p className='p4'>출하계획</p>
                  <label className='label-wrap'>
                    <input type="radio"  value="Y" className="shipmentYn" 
                     onChange={(e)=>onChanged(e)} checked={calCodeData.shipmentYn =='Y'}
                    />
                      사용
                    <input type="radio" value="N" className="shipmentYn" 
                    onChange={(e)=>onChanged(e)} checked={calCodeData.shipmentYn =='N'}
                    />
                      미사용
                  </label>
                </div>
                <div className='detail-list'>
                  <p className='p4'>전화번호</p>
                  <input type="text" id='telNo' onChange={(e)=>onChanged(e)} maxLength={13} onInput={autoHyphen} value={calCodeData.telNo}/>
                </div>
                <div className='detail-list'>
                  <p className='p4'>팩스번호</p>
                  <input type='text' id='faxNo' onChange={(e)=>onChanged(e)} maxLength={10} onInput={autoFax} value={calCodeData.faxNo}></input>
                </div>
                <div className='detail-list'>
                  <p className='p4'>우편번호</p>
                  <label>
                    <input className='detail-box' id='postNo' value={calCodeData.postNo} onChange={handleClick} ></input>
                      <button onClick={handleClick} className='input-button'>
                        <img src={'/img/search.png'} />
                      </button>
                  </label>
                </div>
                <div className='detail-list'>
                  <p className='p4'>기본주소</p>
                  <input type='text' value={calCodeData.addStd} onChange={handleClick}></input>
                </div>
                <div className='detail-list'>
                  <p className='p4'>상세주소</p>
                  <input type='text' id='addDtl' onChange={(e)=>onChanged(e)} value={calCodeData.addDtl}></input>
                </div>
                <div className='detail-list'>
                  <p>당담자</p>
                  <input type='text' id='manNm' onChange={(e)=>onChanged(e)} maxLength={10} onInput={checkReg} value={calCodeData.manNm}></input>
                </div>
                <div className='detail-list'>
                  <p>당담자연락처</p>
                  <input type='text' id='manTelNo' onChange={(e)=>onChanged(e)} maxLength={13} onInput={autoHyphen} value={calCodeData.manTelNo}></input>
                </div>
                <div className='detail-list'>
                  <p>계산서수취메일</p>
                  <input type='text' id='invoiceMail' onChange={(e)=>onChanged(e)} maxLength={50} value={calCodeData.invoiceMail}></input>
                </div>
              </div>
            </div>
          </div> */}

        </div>
      </MainBox>
    </>
  )
};

export default Main;
