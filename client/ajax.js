import $ from 'jquery';
import { serverUrl } from "./../config.json";

const ajax  = (type, url, tryCount, timeout, successCallback, errCallback) => {
  $.ajax({
    type: type,
    url: `${serverUrl}/${url}`,
    timeout: timeout,
    success: successCallback,
    error: () => tryCount > 0 
      ? ajax(tryCount-1, timeout+1000, type, url, successCallback, errCallback)
      : errCallback()
  });
};

export default ajax;
