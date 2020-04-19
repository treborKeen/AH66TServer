            /*global io */
            var socket = io();
            var zData;
            var tuners;
            var mdfText;

            function updateElements() {
                console.log('updateElements  called');
                for (var i = 1; i < 10; i++) {

                    //(document.getElementById('slider' + i)).disabled=false;
                    (document.getElementById('selectAudio' + i)).value = zData[i][0];

                    (document.getElementById('slider' + i)).value = zData[i][1];

                    if (zData[i][0] === "A0")
                        (document.getElementById('slider' + i)).disabled = true;

                    //if(zData[i][0]==="A0")
                    //        (document.getElementById('slider' + i)).style.display="none";


                }

                //tuner1.value = tuners[0].trim() + '0';
                (document.getElementById('tuner1')).value = tuners[0].trim() + '0';
                //tuner2.value = tuners[1].trim() + '0';
                (document.getElementById('mdf')).innerHTML=mdfText;
            }

            socket.on('update', function(tunerData, zoneData, curZone,mdfData) {
                console.log('update  called');

                zData = zoneData;
                tuners = tunerData;
                mdfText=mdfData;
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
                //console.log('emitting' + tuner + value)

                socket.emit('tune', tuner, value);
            }

            function page(value) {

                socket.emit('page', value);

            }

            function sysOff() {

                socket.emit('sysOff');
                document.location.reload(true);

            }
            
            function updateMdf() {

                socket.emit('updateMdf');
                //document.location.reload(true);
            }
            