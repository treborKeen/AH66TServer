            var socket = io();

            socket.on('update', function(tuners, zData) {

                for (i = 1; i < 8; i++) {

                    (document.getElementById('slider' + i)).value = zData[i][1];

                    (document.getElementById('selectAudio' + i)).value = zData[i][0];

                }

                tuner1.value = tuners[0].trim() + '0';
                tuner2.value = tuners[1].trim() + '0';
            });
            // Send data through socket
            function zvol(zone, value) {

                socket.emit('zvol', zone, value);

            }


            function zoneSelect(zone, value) {

                socket.emit('zoneSelect', zone, value);

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
            