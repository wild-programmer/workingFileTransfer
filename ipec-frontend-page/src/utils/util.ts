
/**
 * 存储locaStorage
 * @param params
 */
export async function setContact(params,ipTypeSuperiorNumber) {
  
    var storage=window.localStorage;
    let _contastList = JSON.parse(storage.getItem('contastList'));
    params &&  _contastList.push(params);
    // var _contastList = [{
    //   name:'喵呜',
    //   guid:'111',
    //   ipids:'575',
    // },{
    //   name:'琪琪',
    //   ipids:'576',
    //   guid:'222', 
    // },{
    //   name:'大宝',
    //   ipids:'578',
    //   guid:'333', 
    // }] 
    //写入c字段
    storage.setItem("contastList",JSON.stringify(_contastList));  
    storage.setItem("ipTypeSuperiorNumber",JSON.stringify(ipTypeSuperiorNumber));  
    return _contastList
}
/**
 * 获取locastorage
 * @param params
 */
export async function getContact() {   
    var storage=window.localStorage;
    let _contastList = JSON.parse(storage.getItem('contastList'));
    let _ipTypeSuperiorNumber = JSON.parse(storage.getItem('ipTypeSuperiorNumber'));
    let _params = {
      ipTypeSuperiorNumber:_ipTypeSuperiorNumber,
      ipids:'',
    };
    _contastList.forEach(element => {
      if(_params.ipids == ''){
        _params.ipids = element.ipids        
      }else{
         _params.ipids = _params.ipids +","+ element.ipids
      }
    });
    return _params;
}
/**
 * 获取locastorage
 * @param params
 */
export async function deletContact(ipids) {   
    var storage=window.localStorage;
    let _contastList = JSON.parse(storage.getItem('contastList')); 
    let _params = [];
    _contastList.forEach(element => { 
       if(element.ipids != ipids){
        _params.push(element);
       }
     
    });
    console.log(_params)   
    storage.setItem("contastList",JSON.stringify(_params));  
    if(_params.length == 0){
      storage.setItem("ipTypeSuperiorNumber",JSON.stringify(null));  
    }
    return _params
}
