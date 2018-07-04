const DEVICE_SERIAL_NUMBER_PROBE_INTERVAL = 100;
const DEVICE_SERIAL_NUMBER_LENGTH = 52;
const DEVICE_HANDLE_TIMEOUT = 1 * 60 * 1000;
const NULL_COMMAND_TIMEOUT = 1 * 5 * 1000;
const CHECK_SERIAL_NUMBER_FLUSH_TIMEOUT = 500;

const log = console.log;

var can_log = true;

console.log = function(string){

  if (can_log){

        log(string);

  }



  }

const DEVICE_STATES = Object.freeze({
   "INITED": 0,
   "OPENED": 1,
   "CONNECTED":2,
   "TEST_DATA_SENT": 3,
   "RUBBISH": 4,
   "SERIAL_FOUND": 5,
   "PURGING": 6,
   "DEVICE_IS_READY": 7,
   "DEVICE_ERROR":8
});

const commands_list_robot = {
   "check":{
      "code": "a",
      "params": [],
      "response": {
                   "encoder0" : "uint2",
                   "encoder1" : "uint2",
                   "path0"    : "uint2",
                   "path1"    : "uint2",
                   "a0"       : "ubyte[4]",
                   "a1"       : "ubyte[4]",
                   "a2"       : "ubyte[4]",
                   "a3"       : "ubyte[4]",
                   "a4"       : "ubyte[4]",
                   "button"   : "ubyte"
                  }
   },
   "power":{
      "code": "c",
      "params": ["ubyte", "ubyte"],
      "response": {
                   "encoder0" : "uint2",
                   "encoder1" : "uint2",
                   "path0"    : "uint2",
                   "path1"    : "uint2",
                   "a0"       : "ubyte[4]",
                   "a1"       : "ubyte[4]",
                   "a2"       : "ubyte[4]",
                   "a3"       : "ubyte[4]",
                   "a4"       : "ubyte[4]",
                   "button"   : "ubyte"
                  }
   },
   "rob_encoder":{
      "code": "e",
      "params": ["ubyte"],
      "response": {
                   "encoder0" : "uint2",
                   "encoder1" : "uint2",
                   "path0"    : "uint2",
                   "path1"    : "uint2",
                   "a0"       : "ubyte[4]",
                   "a1"       : "ubyte[4]",
                   "a2"       : "ubyte[4]",
                   "a3"       : "ubyte[4]",
                   "a4"       : "ubyte[4]",
                   "button"   : "ubyte"
                  }
   },
   "rob_lamps":{
      "code": "h",
      "params": ["ubyte"],
      "response": {
                   "encoder0" : "uint2",
                   "encoder1" : "uint2",
                   "path0"    : "uint2",
                   "path1"    : "uint2",
                   "a0"       : "ubyte[4]",
                   "a1"       : "ubyte[4]",
                   "a2"       : "ubyte[4]",
                   "a3"       : "ubyte[4]",
                   "a4"       : "ubyte[4]",
                   "button"   : "ubyte"
                  }
   },
   "rob_pow_encoder":{
      "code": "g",
      "params": ["ubyte", "ubyte","ubyte","ubyte"],
      "response": {
                   "encoder0" : "uint2",
                   "encoder1" : "uint2",
                   "path0"    : "uint2",
                   "path1"    : "uint2",
                   "a0"       : "ubyte[4]",
                   "a1"       : "ubyte[4]",
                   "a2"       : "ubyte[4]",
                   "a3"       : "ubyte[4]",
                   "a4"       : "ubyte[4]",
                   "button"   : "ubyte"
                  }
   },
   "rob_claw":{
      "code": "j",
      "params": ["ubyte"],
      "response": {
                   "encoder0" : "uint2",
                   "encoder1" : "uint2",
                   "path0"    : "uint2",
                   "path1"    : "uint2",
                   "a0"       : "ubyte[4]",
                   "a1"       : "ubyte[4]",
                   "a2"       : "ubyte[4]",
                   "a3"       : "ubyte[4]",
                   "a4"       : "ubyte[4]",
                   "button"   : "ubyte"
                  }
   },
   "sensors":{
      "code": "i",
      "params": ["ubyte", "ubyte", "ubyte", "ubyte", "ubyte"],
      "response": {
                   "encoder0" : "uint2",
                   "encoder1" : "uint2",
                   "path0"    : "uint2",
                   "path1"    : "uint2",
                   "a0"       : "ubyte[4]",
                   "a1"       : "ubyte[4]",
                   "a2"       : "ubyte[4]",
                   "a3"       : "ubyte[4]",
                   "a4"       : "ubyte[4]",
                   "button"   : "ubyte"
                  }
   }
 };

 const commands_list_laboratory = {
    "check":{
       "code": "a",
       "params": [],
       "response": {
                       "d8_13" : "ubyte",
                       "a0"       : "ubyte",
                       "a1"       : "ubyte",
                       "a2"       : "ubyte",
                       "a3"       : "ubyte",
                       "a4"       : "ubyte",
                       "a5"       : "ubyte",
                       "a6"       : "ubyte",
                       "a7"       : "ubyte",
                       "a8"       : "ubyte",
                       "a9"       : "ubyte",
                       "a10"       : "ubyte",
                       "a11"       : "ubyte",
                       "a12"       : "ubyte",
                       "a13"       : "ubyte",
                       "a14"       : "ubyte",
                       "a15"       : "ubyte"

                   }
    },
    "lab_lamps":{
       "code": "b",
       "params": ["ubyte"],
       "response": {
                     "d8_13" : "ubyte",
                     "a0"       : "ubyte",
                     "a1"       : "ubyte",
                     "a2"       : "ubyte",
                     "a3"       : "ubyte",
                     "a4"       : "ubyte",
                     "a5"       : "ubyte",
                     "a6"       : "ubyte",
                     "a7"       : "ubyte",
                     "a8"       : "ubyte",
                     "a9"       : "ubyte",
                     "a10"       : "ubyte",
                     "a11"       : "ubyte",
                     "a12"       : "ubyte",
                     "a13"       : "ubyte",
                     "a14"       : "ubyte",
                     "a15"       : "ubyte"

                   }
    },

    "lab_color_lamps":{
       "code": "c",
       "params": ["ubyte"],
       "response": {
                     "d8_13" : "ubyte",
                     "a0"       : "ubyte",
                     "a1"       : "ubyte",
                     "a2"       : "ubyte",
                     "a3"       : "ubyte",
                     "a4"       : "ubyte",
                     "a5"       : "ubyte",
                     "a6"       : "ubyte",
                     "a7"       : "ubyte",
                     "a8"       : "ubyte",
                     "a9"       : "ubyte",
                     "a10"       : "ubyte",
                     "a11"       : "ubyte",
                     "a12"       : "ubyte",
                     "a13"       : "ubyte",
                     "a14"       : "ubyte",
                     "a15"       : "ubyte"

                   }
    },

    "lab_dig_on":{
       "code": "e",
       "params": ["ubyte"],
       "response": {
                     "d8_13" : "ubyte",
                     "a0"       : "ubyte",
                     "a1"       : "ubyte",
                     "a2"       : "ubyte",
                     "a3"       : "ubyte",
                     "a4"       : "ubyte",
                     "a5"       : "ubyte",
                     "a6"       : "ubyte",
                     "a7"       : "ubyte",
                     "a8"       : "ubyte",
                     "a9"       : "ubyte",
                     "a10"       : "ubyte",
                     "a11"       : "ubyte",
                     "a12"       : "ubyte",
                     "a13"       : "ubyte",
                     "a14"       : "ubyte",
                     "a15"       : "ubyte"

                   }
    },


    "lab_dig_off":{
       "code": "f",
       "params": ["ubyte"],
       "response": {
                     "d8_13" : "ubyte",
                     "a0"       : "ubyte",
                     "a1"       : "ubyte",
                     "a2"       : "ubyte",
                     "a3"       : "ubyte",
                     "a4"       : "ubyte",
                     "a5"       : "ubyte",
                     "a6"       : "ubyte",
                     "a7"       : "ubyte",
                     "a8"       : "ubyte",
                     "a9"       : "ubyte",
                     "a10"       : "ubyte",
                     "a11"       : "ubyte",
                     "a12"       : "ubyte",
                     "a13"       : "ubyte",
                     "a14"       : "ubyte",
                     "a15"       : "ubyte"

                   }
    },

    "lab_dig_pwm":{
       "code": "g",
       "params": ["ubyte","ubyte"],
       "response": {
                     "d8_13" : "ubyte",
                     "a0"       : "ubyte",
                     "a1"       : "ubyte",
                     "a2"       : "ubyte",
                     "a3"       : "ubyte",
                     "a4"       : "ubyte",
                     "a5"       : "ubyte",
                     "a6"       : "ubyte",
                     "a7"       : "ubyte",
                     "a8"       : "ubyte",
                     "a9"       : "ubyte",
                     "a10"       : "ubyte",
                     "a11"       : "ubyte",
                     "a12"       : "ubyte",
                     "a13"       : "ubyte",
                     "a14"       : "ubyte",
                     "a15"       : "ubyte"
                   }
    },

    "lab_sound":{
       "code": "d",
       "params": ["ubyte"],
       "response": {
                 "d8_13" : "ubyte",
                 "a0"       : "ubyte",
                 "a1"       : "ubyte",
                 "a2"       : "ubyte",
                 "a3"       : "ubyte",
                 "a4"       : "ubyte",
                 "a5"       : "ubyte",
                 "a6"       : "ubyte",
                 "a7"       : "ubyte",
                 "a8"       : "ubyte",
                 "a9"       : "ubyte",
                 "a10"       : "ubyte",
                 "a11"       : "ubyte",
                 "a12"       : "ubyte",
                 "a13"       : "ubyte",
                 "a14"       : "ubyte",
                 "a15"       : "ubyte"

                   }
    }

};

const DEVICES = Object.freeze({
   //Basic Robot
   0:{
      "firmware":7,
      "commands":commands_list_robot
   },
   3:{
      "firmware":7,
      "commands":commands_list_robot
   },

   //Old lab
   1:{

     "firmware":5,
     "commands": commands_list_laboratory
   },

   //New lab
   2:{

     "firmware":2,
     "commands": commands_list_laboratory

   },
   //Old lab
   4:{

     "firmware":5,
     "commands": commands_list_laboratory

   }
});


var arrDevices = [];



function InterfaceDevice(port){
   this.port = port;
   var LOG = "[" + port.path + " random_object_identifier: " +  (Math.floor( Math.random() * 100) ) +  "] ";

   console.log(LOG + "Trying to register a new device...");

   var state = DEVICE_STATES["INITED"];
   var previous_state = state;
   var bufIncomingData = new Uint8Array();
   var iConnectionId;
   var iDeviceID;
   var iFirmwareVersion;
   var sSerialNumber;
   var iSerialNumberOffset;
   var iWaiting = 0;
   var response = {};
   var commandToRun = null;
   var callback = null;
   var automaticStopCheckingSerialNumberTimeout

   var isStopCheckingSerialNumber = false;

   var commands_stack = [];

   var    time1 = Date.now();
   var    time_delta = 0;
   var    time2 = Date.now();

   var command_try_send_time1 = null;
   var command_try_send_time2 = null;

   var check_serial_number_time1 = Date.now();
   var check_serial_number_time2 = Date.now();

   var can_check_serial_after_flush = true;

   var wait_for_sync = false;

   var recieveListener;

   var bitrate = 115200;


   var onReceiveCallback = function(info){
  //    console.log(LOG + "CALLBACK!!! without data");
      if((info.connectionId == iConnectionId) && info.data){
         var buf = new Uint8Array(info.data);

         console.log(LOG + "CALLBACK!!! bytes recieved length <- " + buf.length);
         console.log(LOG + "CALLBACK!!! bytes buf <- " + buf);

         console.log(LOG + "wait_for_sync: " + wait_for_sync);

          var bufIncomingDataNew = null;

         // if ((wait_for_sync) && (buf[0] != 35 ) ){
         //
         //      if (buf.indexOf(35) != -1){
         //
         //         console.log(LOG + "# not in the 0 position but is in data. Making subarray.");
         //
         //        let local_buf =  new Uint8Array(buf.length - buf.indexOf(35));
         //
         //        wait_for_sync = false;
         //
         //
         //
         //        local_buf = buf.subarray(buf.indexOf(35) - 1);
         //
         //
         //        buf = local_buf;
         //
         //        wait_for_sync = false;
         //
         //         bufIncomingDataNew = new Uint8Array(bufIncomingData.length + buf.length);
         //         bufIncomingDataNew.set(bufIncomingData);
         //         bufIncomingDataNew.set(buf, bufIncomingData.length);
         //
         //         bufIncomingData = bufIncomingDataNew;
         //
         //
         //
         //      }else{
         //
         //             console.log(LOG + "# not in the data.");
         //
         //      }
         //
         //
         // }else{

          wait_for_sync = false;

           bufIncomingDataNew = new Uint8Array(bufIncomingData.length + buf.length);
           bufIncomingDataNew.set(bufIncomingData);
           bufIncomingDataNew.set(buf, bufIncomingData.length);

           bufIncomingData = bufIncomingDataNew;

      //   }


           console.log(LOG + "wait_for_sync: " + wait_for_sync);
           console.log(LOG + "bufIncomingData: " + bufIncomingData);



         //We are not waiting for any data;
         if(commandToRun == null) return;


        // commandToRun = null;


                                                                                //#
         if ( (bufIncomingData.length >= iWaiting) /*&& ( bufIncomingData.indexOf(35) != -1 )*/ ){
            console.log(LOG + "command '" + commandToRun.code + "' complete.");

            wait_for_sync = true;

            //all params
            var iResponsePointer = /*(bufIncomingData.indexOf(35) + 1);*/ 1;
            Object.keys(commandToRun.response).forEach(function (sField){
               switch(commandToRun.response[sField]){
                  case "uint2":{
                     response[sField] = bufIncomingData[iResponsePointer] * 256 + bufIncomingData[iResponsePointer + 1];
                     iResponsePointer += 2;
                     break;
                  }
                  case "ubyte[4]":{
                     response[sField] = [];
                     response[sField].push(bufIncomingData[iResponsePointer]);
                     response[sField].push(bufIncomingData[iResponsePointer + 1]);
                     response[sField].push(bufIncomingData[iResponsePointer + 2]);
                     response[sField].push(bufIncomingData[iResponsePointer + 3]);
                     iResponsePointer += 4; //modified +=2
                     break;
                  }
                  case "ubyte":{
                     response[sField] = bufIncomingData[iResponsePointer];
                     iResponsePointer += 1;
                     break;
                  }
               }
            });

            //console.log(response);
            commandToRun = null;

            /******/

                  // if (commands_stack.length >= 1){
                  //
                  // //  let command_object =  commands_stack.shift();
                  //
                  //   commands_stack.forEach(function(command_object,command_object_index){
                  //
                  //       console.log(`Shift strange: ${command_object.command.code} command_object_index: ${command_object_index}`);
                  //
                  //   } );
                  //
                  // let  commandToRun_local  = command_object.command;
                  // let  params_local        = command_object.params;
                  // let  fCallback_local     = command_object.fCallback;
                  // let  self                = command_object.self;
                  //
                  // self.command(commandToRun_local,params_local,fCallback_local);
                  //
                  // }

            /******/

            iWaiting = 0;
            callback(response);
         }

             console.log(LOG + "wait_for_sync after: " + wait_for_sync);

      }
   };

   var onErrorCallback = function (info){

     console.log("onErrorCallback");

      if (info.connectionId == iConnectionId){

          console.error(LOG + "error: " + info.error);

          if (info.error == "break"){

             console.error(LOG + "error: " + info.error);

               state = DEVICE_STATES["DEVICE_ERROR"];

              chrome.serial.setPaused(iConnectionId, false, function (){


                     console.error("Unpaused.");

                       state = DEVICE_STATES["CONNECTED"];


              });


            // chrome.serial.clearBreak(iConnectionId, function (result){
            //
            //       console.error(LOG + "clear break:" + result);
            //
            //
            // })

          }else if ( (info.error == "overrun") || (info.error == "frame_error") ) {


            chrome.serial.setPaused(iConnectionId, false, function (){

                    console.log("Unpaused.");

            });


            //    console.error(LOG + "Ignore these errors!");


          } else if ((info.error == "device_lost")){

             console.error(LOG + "error: " + info.error);


        if (state != DEVICE_STATES["DEVICE_ERROR"]){

            state = DEVICE_STATES["DEVICE_ERROR"];
            //
            // chrome.serial.setPaused(iConnectionId, false, function (){
            //
            //          console.error("Unpaused.");

                  //  state = DEVICE_STATES["OPENED"];

                //   chrome.serial.connect(port.path, {bitrate: 115200}, onConnect);

                    chrome.serial.disconnect(iConnectionId, function(result){

                          console.error("Connection closed: " + result);

                          console.error("Trying to reconnect");


                          if (result){

                                  chrome.serial.connect(port.path, {bitrate: bitrate}, onConnect);


                          }

                    });

          //  });



        }

          } else if (info.error == "disconnected") {


            if (state!= DEVICE_STATES["DEVICE_ERROR"]){

                state = DEVICE_STATES["DEVICE_ERROR"];

            chrome.serial.setPaused(iConnectionId, false, function (){

                    console.log("Unpaused.");




                      chrome.serial.disconnect(iConnectionId, function(result){



                             console.error("Connection closed: " + result);

                             // console.log("tying to reconnect");
                             //
                             //  chrome.serial.connect(port.path, {bitrate: 115200}, onConnect);
                      });





            });


          }


          } else {

             console.error("Other errors");


            if (state!= DEVICE_STATES["DEVICE_ERROR"]){

                state = DEVICE_STATES["DEVICE_ERROR"];

            chrome.serial.setPaused(iConnectionId, false, function (){

                    console.log("Unpaused.");




                      chrome.serial.disconnect(iConnectionId, function(result){



                             console.error("Connection closed: " + result);

                             // console.log("tying to reconnect");
                             //
                             //  chrome.serial.connect(port.path, {bitrate: 115200}, onConnect);
                      });





            });


          }




          }





      }

   }

   var onSend = function(){

     if ( commandToRun != null){

          console.log(LOG + "buffer sent." + "command: " + commandToRun.code );

     }else{


            console.log(LOG + "buffer sent.");

     }


      time1 = Date.now();
      time_delta = time1 - time2;
      console.log("time delta: " + time_delta)
      time2 = Date.now();

      console.log(LOG + "wait_for_sync: " + wait_for_sync);
   };
   var onFlush = function(){
      console.log(LOG + "port flushed.");
      commandToRun = null;
      can_check_serial_after_flush = true;
   }

   var purgePort = function(){
      console.log(LOG + "purge()");
      state = DEVICE_STATES["PURGE"];
      if(bufIncomingData.length > 0){
         chrome.serial.flush(iConnectionId, onFlush);
         bufIncomingData = new Uint8Array();
         setTimeout(purgePort, 300);
      }
      else{

          if ( (typeof(iDeviceID) != 'undefined') && (typeof(iFirmwareVersion) != 'undefined') && (typeof(sSerialNumber) != 'undefined') ){

                if ( (!isNaN(iDeviceID)) && (!isNaN(iFirmwareVersion)) && ( ( (sSerialNumber).startsWith("R") ) || ((sSerialNumber).startsWith("L")) ) ) {

                        console.log(LOG + "device is ready.");
                        state = DEVICE_STATES["DEVICE_IS_READY"];
                        previous_state = state;
                        wait_for_sync = true;

                        return;

                }

          }

          setTimeout(checkSerialNumber, 100);


      }
   }


   var getSerial = function(){
      console.log(LOG + "-> getSerial()");
      console.log(LOG + "wait_for_sync: " + wait_for_sync);
      var buf=new ArrayBuffer(1);
      var bufView=new Uint8Array(buf);
      bufView[0] = 32;

    //  for(var i = 0; i < 1000; i++){

         chrome.serial.send(iConnectionId, buf, onSend);
    //  }
      state = DEVICE_STATES["TEST_DATA_SENT"];

  //    wait_for_sync=false;
   }

   var checkSerialNumber = function(){
      console.log(LOG + "let's check the serial");
      console.log(LOG + "wait_for_sync: " + wait_for_sync);

      var sIncomingData = new TextDecoder("utf-8").decode(bufIncomingData);
      console.log(LOG + "Now we have: " + sIncomingData);

      console.log(LOG + "wait_for_sync: " + wait_for_sync);

      if(bufIncomingData.length > DEVICE_SERIAL_NUMBER_PROBE_INTERVAL){
         iSerialNumberOffset = sIncomingData.indexOf("ROBBO");
         if(iSerialNumberOffset < 0){
            console.log(LOG + "Rubbish instead of serial number");
            state = DEVICE_STATES["RUBBISH"];
            bufIncomingData = new Uint8Array();
            setTimeout(checkSerialNumber, 100);
         }
         else{
            iDeviceID        = parseInt(sIncomingData.substring(iSerialNumberOffset + 6, iSerialNumberOffset + 11));
            iFirmwareVersion = parseInt(sIncomingData.substring(iSerialNumberOffset + 12, iSerialNumberOffset + 17));
            sSerialNumber    = sIncomingData.substring(iSerialNumberOffset + 18, iSerialNumberOffset + DEVICE_SERIAL_NUMBER_LENGTH);
            console.warn(LOG + "Device=" + iDeviceID + " Firmware=" + iFirmwareVersion + " Serial='" + sSerialNumber + "'");

            purgePort();
         }
      }
      else{



         if(/*(sSerialNumber === undefined) && */ (can_check_serial_after_flush) &&  (state != DEVICE_STATES["DEVICE_IS_READY"])  &&   (!isStopCheckingSerialNumber)/* && (state != DEVICE_STATES["DEVICE_ERROR"])*/ ) {


            // check_serial_number_time2 = Date.now();
            //
            // if ((check_serial_number_time2 - check_serial_number_time1)>= CHECK_SERIAL_NUMBER_FLUSH_TIMEOUT){
            //
            //         console.log('CHECK_SERIAL_NUMBER_FLUSH_TIMEOUT');
            //
            //         chrome.serial.flush(iConnectionId, onFlush);
            //
            //         can_check_serial_after_flush = false;
            //
            //         check_serial_number_time1 = Date.now();
            //
            //
            // }else{
            //
            //       //Let's send the space
            //       getSerial();
            // }

            if ( (iConnectionId != null) && (state != DEVICE_STATES["DEVICE_ERROR"]) ) {

                  getSerial();

            }else{


                console.log(LOG + "Does not call getSerial()");
            }


            //Let's check the response
           let checkSerialNumberTimeout =   setTimeout(checkSerialNumber, 100); //100

         }else{

                  console.log(LOG + "Out of checkSerialNumber timeout." + "state: " + state);

         }
      }
   }

   var onConnect = function(connectionInfo){

           if(typeof(connectionInfo)!== "undefined")
           {console.log(LOG + "connected.");
           state = DEVICE_STATES["CONNECTED"];

           iConnectionId = connectionInfo.connectionId;

           if (typeof(iConnectionId) == 'undefined'){

                 state = DEVICE_STATES["DEVICE_ERROR"];

           }

             console.log(LOG + "iConnectionId:" + iConnectionId);


             bufIncomingData = new Uint8Array();
             iWaiting = 0;
             commandToRun = null;
             wait_for_sync=false;

             console.log(LOG + "wait_for_sync: " + wait_for_sync);

             chrome.serial.flush(iConnectionId, onFlush);
             can_check_serial_after_flush = false;

       //if (recieveListener){


               console.log(LOG + " Remove recieve listner");
              chrome.serial.onReceive.removeListener(onReceiveCallback);

       //}

           recieveListener =  chrome.serial.onReceive.addListener(onReceiveCallback);

       //    chrome.serial.onReceiveError.addListener(onErrorCallback);

          setTimeout(checkSerialNumber, 300);

          clearTimeout(automaticStopCheckingSerialNumberTimeout);

           automaticStopCheckingSerialNumberTimeout =  setTimeout(function(){


               console.log("Stop checking serial number.");
             //  clearTimeout(checkSerialNumberTimeout);
               isStopCheckingSerialNumber = true;

               // chrome.serial.disconnect(iConnectionId, function(result){
               //
               //        console.log("Connection closed: " + result);
               // });



           }  ,DEVICE_HANDLE_TIMEOUT);

             console.log(LOG + "wait_for_sync: " + wait_for_sync);
           }

   }

   this.stopCheckingSerialNumber = function(){

     if (!isStopCheckingSerialNumber){

       isStopCheckingSerialNumber = true;



       clearTimeout(automaticStopCheckingSerialNumberTimeout);

       if ( (state != DEVICE_STATES["DEVICE_ERROR"]) && (  iConnectionId != null) ) {


         chrome.serial.disconnect(iConnectionId, function(result){

                console.log("Connection closed: " + result);

                iConnectionId = null;
         });

       }



     }


   }


    // chrome.serial.onReceive.addListener(onReceiveCallback);
    //

    console.log(LOG + " Remove ReceiveError listner");
    chrome.serial.onReceiveError.removeListener(onErrorCallback);

     chrome.serial.onReceiveError.addListener(onErrorCallback);


   chrome.serial.connect(port.path, {bitrate: bitrate}, onConnect);//38400

   setTimeout(()=>{

    if(state != DEVICE_STATES["DEVICE_IS_READY"])
    {

      chrome.serial.disconnect(iConnectionId, (result) =>{

             console.log("Connection closed: " + result);

             iConnectionId = null;

             bitrate = 38400;
             chrome.serial.connect(port.path, {bitrate: bitrate}, onConnect);
      });



    }

  },5000);

   this.try_to_reconnect = function(){


     // state = DEVICE_STATES["INITED"];


     sSerialNumber = undefined;

      iWaiting = 0;
      response = {};
      commandToRun = null;
      callback = null;


      isStopCheckingSerialNumber = false;

      commands_stack = [];

         time1 = Date.now();
         time_delta = 0;
         time2 = Date.now();

      command_try_send_time1 = null;
      command_try_send_time2 = null;

      check_serial_number_time1 = Date.now();
      check_serial_number_time2 = Date.now();

      can_check_serial_after_flush = true;

      wait_for_sync = false;

     if (state == DEVICE_STATES["DEVICE_ERROR"]){




       chrome.serial.connect(this.port.path, {bitrate: bitrate}, onConnect);

     }else{


    //   chrome.serial.disconnect(iConnectionId, function(result){



        //      console.error("Connection closed: " + result);


              chrome.serial.connect(this.port.path, {bitrate: bitrate}, onConnect);
    //   });


     }



   }


   this.getState = function(){
      return state;
   }

   this.getDeviceID = function(){
      return iDeviceID;
   }

   this.getPortName = function(){
      return this.port.path;
   }

   this.getSerialNumber = function(){

        return sSerialNumber;

   }

   this.command = function(command, params, fCallback){
    //  if(commandToRun != null) return;
    //  commandToRun = command;


    var fCallback = fCallback;

    var command_local = command;
    var params_local  = params;

    command_try_send_time2 = Date.now();

    // if ((command_try_send_time2 - command_try_send_time1) >= NULL_COMMAND_TIMEOUT ){
    //
    //
    //     if (command == DEVICES[iDeviceID].commands.check){
    //
    //
    //             console.log(`NULL_COMMAND_TIMEOUT`);
    //
    //             commandToRun = null;
    //             wait_for_sync = true;
    //     }
    //
    //
    //
    //
    // }

      if(commandToRun != null){

        if ((command != DEVICES[iDeviceID].commands.check) ){

             console.log(`buffering commands1... buffer length: ${commands_stack.length}`);

            commands_stack.push({command:command,params:params,fCallback:fCallback,self:this});

              commands_stack.forEach(function(command_object,command_object_index){

                  console.log(`After push: ${command_object.command.code} command_object_index1: ${command_object_index}`);

              } );

        }


          return;

      }


      if (commands_stack.length > 500){

            commands_stack = [];

      }

      if (commands_stack.length > 0){


        if ( (command != DEVICES[iDeviceID].commands.check) ){

          console.log(`buffering commands2... buffer length: ${commands_stack.length}`);

          commands_stack.push({command:command,params:params,fCallback:fCallback,self:this});


          commands_stack.forEach(function(command_object,command_object_index){

              console.log(`Before shift: ${command_object.command.code} command_object_index2: ${command_object_index}`);

          } );

        }



          let command_object          =  commands_stack.shift();

          commandToRun                = command_object.command;
          command_local               = command_object.command; //Suprise!!!
          params_local                = command_object.params; //Surprise!!!
          fCallback                   = command_object.fCallback;

          commands_stack.forEach(function(command_object,command_object_index){

              console.log(`After shift: ${command_object.command.code} command_object_index3: ${command_object_index}`);

          } );


      }else{

          commandToRun  = command;
          command_local = command;
          params_local  = params;

      }

      // setTimeout(function(){
      //
      //     commandToRun=null;
      //
      // },500)


      command_try_send_time1 = Date.now();

      bufIncomingData = new Uint8Array();
      var buf=new ArrayBuffer(command_local.code.length + params_local.length + 1);
      var bufView=new Uint8Array(buf);
      var bufCommand = new TextEncoder("utf-8").encode(command_local.code);
      bufView.set(bufCommand);

      var iParamOffset = 0;
      params_local.forEach(function(param){
         bufView[bufCommand.length + iParamOffset] = param;
         iParamOffset++;
      });

      bufView[bufCommand.length + iParamOffset] = 36;

      //console.log(buf);

      chrome.serial.send(iConnectionId, buf, onSend);

      console.log(`sending command: ${command_local.code}`)

      //for #
      var iWaitingNew = 1;

      //all params
      Object.keys(command_local.response).forEach(function (sField){
         switch(command_local.response[sField]){
            case "uint2":{
               iWaitingNew += 2;
               break;
            }
            case "ubyte[4]":{
               iWaitingNew += 4;
               break;
            }
            case "ubyte":{
               iWaitingNew += 1;
               break;
            }
         }
      });

      callback = fCallback;

      console.log(LOG + "we wating for " + iWaitingNew + " bytes");
      iWaiting = iWaitingNew;
   }


   // var onGetDevices = function(ports) {
   //   for (var i=0; i<ports.length; i++) {
   //     console.log(ports[i].path);
   //     var device = new InterfaceDevice(ports[i]);
   //      arrDevices.push(device);
   //   }
   // }
   //
   // this.searchDevices(callback){
   //
   //    chrome.serial.getDevices(callback);
   //
   // }
   //
   //
   // this.getConnectedDevices(){
   //
   //
   //
   // }


}


const searchDevices = function(){

//  arrDevices = [];

    if (arrDevices.length > 0){


        arrDevices.forEach(function(device,index){

              arrDevices[index].stopCheckingSerialNumber();
              arrDevices[index] = null;

        });

    }

     arrDevices = [];

  var onGetDevices = function(ports) {
    for (var i=0; i<ports.length; i++) {
      console.log(ports[i].path);
      var device = new InterfaceDevice(ports[i]);
       arrDevices.push(device);
    }
  }

    chrome.serial.getDevices(onGetDevices);

};

const pushConnectedDevices = function(device){

  arrDevices.push(device);

}

const getConnectedDevices = function(){

    return arrDevices;

}


const trigger_logging = function(){


        can_log = !can_log;

}



// var fuck = false;
// var mainLoop = function(){
//    arrDevices.forEach(function(device) {
//       if(device.getDeviceID() == 0 && device.getState() == DEVICE_STATES["DEVICE_IS_READY"]){
//
//          if(!fuck){
//             device.command(DEVICES[0].commands.sensors, [7, 0, 0, 0, 0], function(response){
//                console.log("pizda=" + response.a0);
//             });
//             fuck = true;
//             return;
//          }
//          device.command(DEVICES[0].commands.power, [0, 0], function(response){
//             console.log("pizda=" + response.a0);
//          });
//       }
//    });
//
//    setTimeout(mainLoop, 100);
// }














export  {

  InterfaceDevice,
  searchDevices,
  getConnectedDevices,
  pushConnectedDevices,
  DEVICES,
  DEVICE_STATES,
  trigger_logging


};

// chrome.app.runtime.onLaunched.addListener(function() {
//   // Center window on screen.
//   var screenWidth = screen.availWidth;
//   var screenHeight = screen.availHeight;
//   var width = 500;
//   var height = 300;
//
//
//   chrome.serial.getDevices(onGetDevices);
//   mainLoop();
//
//
//   chrome.app.window.create('index.html', {
//     id: "helloWorldID",
//     outerBounds: {
//       width: width,
//       height: height,
//       left: Math.round((screenWidth-width)/2),
//       top: Math.round((screenHeight-height)/2)
//     }
//   });
// });
