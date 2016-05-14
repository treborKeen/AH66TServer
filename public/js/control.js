            var socket = io();
            var zData;
            var tuners;
            
            function updateElements() {

                for (i = 1; i < 13; i++) {

                    //(document.getElementById('slider' + i)).disabled=false;
                    (document.getElementById('selectAudio' + i)).value = zData[i][0];
                    
                    (document.getElementById('slider' + i)).value = zData[i][1];
                    
                    if(zData[i][0]==="A0")
                        (document.getElementById('slider' + i)).disabled=true;
                        
                //if(zData[i][0]==="A0")
                //        (document.getElementById('slider' + i)).style.display="none";
                    

                }

                tuner1.value = tuners[0].trim() + '0';
                tuner2.value = tuners[1].trim() + '0';
            }

            socket.on('update', function(tunerData, zoneData, curZone) {
                  console.log('update  called');
                  
                zData=zoneData;
                tuners=tunerData;
                console.log('tuners are' + tuners);
                updateElements();
            });
            
            // Send data through socket
            function zvol(zone, value) {

                socket.emit('zvol', zone, value);

            }


            function zoneSelect(zone, value) {

                socket.emit('zoneSelect', zone, value);
                document.location.reload(true);

            }
            
            

            function tune(tuner, value) {
                console.log('emitting' + tuner + value)

                socket.emit('tune', tuner, value);

            }

            function page(value) {

                socket.emit('page', value);

            }

            function sysOff() {

                socket.emit('sysOff');

            }