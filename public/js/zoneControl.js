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
                    (document.getElementById('bassSlider')).value = parseInt(zData[currentZone][2]);
                    (document.getElementById('trebelSlider')).value = parseInt(zData[currentZone][3]);
                    
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
            function zvol(value) {

                socket.emit('zvol', currentZone, value);

            }


            function zoneSelect(value) {

                socket.emit('zoneSelect', currentZone, value);
                //updateElements();
                document.location.reload(true);

            }
            
            function trebelSelect(value) {

                socket.emit('trebelSelect', currentZone, value);
                //document.location.reload(true);

            }
            
            function bassSelect(value) {

                socket.emit('bassSelect', currentZone, value);
                //document.location.reload(true);

            }
            

            function tune(tuner, value) {
                //console.log('emitting' + tuner + value)

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
            