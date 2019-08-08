import { Component } from '@angular/core';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {SMS} from '@ionic-native/sms';
import {Sim} from '@ionic-native/sim/ngx';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    public data: any = [];
    public formControls: any = [];

  constructor(private androidPermissions: AndroidPermissions, private sim: Sim) {
    this.data = [];
    this.formControls = [];
  }

  sendSms() {
    // this.sendSmsToSelectedNumber('0');
  }

  checkSimPermission() {
      this.sim.hasReadPermission().then(
          (res) => {
              console.log('Has sim permission: ', res);
              // this.sim.getSimInfo().then(
              //     (info) => console.log('Sim info: ', info),
              //     (err) => console.log('Unable to get sim info: ', err)
              // );
          }
      ).catch(e => {
          this.sim.requestReadPermission().then(
              () => {
                  console.log('Permission sim granted');
                  // this.sim.getSimInfo().then(
                  //     (info) => console.log('Sim info: ', info),
                  //     (err) => console.log('Unable to get sim info: ', err)
                  // );
              },
              () => console.log('Permission sim denied')
          );
      });
  }

  sendSmsToSelectedNumber(receiverNum: string, receiverMsg: string) {
      const options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
              // intent: 'INTENT'  // send SMS with the native android SMS messaging
              intent: '' // send SMS without opening any other app
          }
      };

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
        result => {
          if (result.hasPermission) {

            SMS.send(receiverNum, receiverMsg, options).then(res => {
                // console.log('111');
                // console.log(res);
            }).catch(e => {
                // console.log('222');
                // console.log(e);
                SMS.send(receiverNum, receiverMsg, options).then(res => {
                    // console.log('111');
                    // console.log(res);
                }).catch(e => {
                    // console.log('222');
                    // console.log(e);
                    this.sendSmsToSelectedNumber(receiverNum, receiverMsg);
                });
            });
            // console.log('has permission');
          } else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
                .then(
                    () => {
                      // call method to turn on GPS
                        SMS.send(receiverNum, receiverMsg, options).then(res => {
                            // console.log(res);
                        }).catch(e => {
                            // console.log(e);
                            this.sendSmsToSelectedNumber(receiverNum, receiverMsg);
                        });
                        // console.log('has permission 2');
                    },
                    error => {

                      alert('requestPermission Error requesting location permissions ' + error);
                    }
                );
          }
        },
        err => {
          alert(err);
        }
    );
  }

    onFileChange(evt: any) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            this.data = (XLSX.utils.sheet_to_json(ws, {header: 1}));
            // console.log(this.data);
            this.analyzeData();
        };
        reader.readAsBinaryString(target.files[0]);
    }

    private analyzeData() {
        this.formControls = [];
        for (const j in this.data[0]) {
            this.formControls.push({label: 'Text ' + (parseInt(j, 10) + 1) + ' - col ' + (parseInt(j, 10) + 2), value: ''});
        }

    }

    formSubmit() {

        for (const index in this.data) {
            if ( (parseInt(index, 10) > 0) && (this.data[parseInt(index, 10)][0]) ) {

                // console.log(this.formControls);
                // console.log(this.data);
                let text = '';
                for (const i in this.formControls) {
                    if ((this.formControls[i].value) && (this.data[parseInt(index, 10)][parseInt(i, 10) + 1])) {
                        text = text + this.formControls[i].value + ' ' + this.data[parseInt(index, 10)][parseInt(i, 10) + 1] + ' ';
                    }

                }

                // console.log(text);
                setTimeout(() => {
                    this.sendSmsToSelectedNumber(this.data[parseInt(index, 10)][0], text);
                }, 100);

            }
        }

        alert('Check your message box for message history');


    }

}
