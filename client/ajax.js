import $ from 'jquery';
import { NotificationManager } from 'react-notifications';
import { serverUrl } from "./../config.json";

const ajax  = (type, url, tryCount, timeout, successCallback, errCallback) => {
  $.ajax({
    type: type,
    url: `${serverUrl}/${url}`,
    timeout: timeout,
    success: successCallback,
    error: () => tryCount > 0 
      ? ajax(type, url, tryCount-1, timeout+1000, successCallback, errCallback)
      : () => {
        NotificationManager.error(`Problem with request of type ${type} to ${url} occurred...`);
        errCallback();
      }
  });
};

export default ajax;
