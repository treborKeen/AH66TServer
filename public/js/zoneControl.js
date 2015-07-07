            var socket = io();
            var currentZone;
            var zData;
            var tuners;
            
            function updateElements() {
                console.log("calling update with zone"+currentZone);
                    (document.getElementById('slider')).disabled=false;
                    (document.getElementById('zone')).value = currentZone;
                    (document.getElementById('selectAudio')).value = zData[currentZone][0];
                    (document.getElementById('slider')).value = zData[currentZone][1];
                    
                    if(zData[currentZone][0]==="A0")
                        (document.getElementById('slider')).disabled=true;
                        
                //if(zData[i][0]==="A0")
                //        (document.getElementById('slider' + i)).style.display="none";
                    

                

                tuner1.value = tuners[0].trim() + '0';
                tuner2.value = tuners[1].trim() + '0';
            }

            socket.on('update', function(tunerData, zoneData, curZone) {
                console.log('update  called');
                currentZone = curZone;  
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
                //updateElements();
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
            
            function updateZone(value) {

               socket.emit('updateZone',value);
document.location.reload(true);
            }
            