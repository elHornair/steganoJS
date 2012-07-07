self.addEventListener('message', function(e) {
    var data = e.data,

        _stringToBinary = function (sourceString) {
            var i = 0,
                n = sourceString.length,
                currentCharBits,
                fillString = '00000000',
                resultBitString = '';

            for (i = 0; i < n; i+=1) {
                currentCharBits = fillString + sourceString.charCodeAt(i).toString(2);// if the char code doesn't take a full byte, we fill it with zeros
                resultBitString += currentCharBits.substr(-8);
            }

            return resultBitString;
        },

        _hideText = function (data) {
            var textToHide = "---------------" + data.textToHide,// TODO: do filling in a more proper way
                containerData = data.containerData,
                containerPixels = containerData.data,
                bitStringToHide = _stringToBinary(textToHide),
                n = Math.ceil((bitStringToHide.length/3) * 4),
                i,
                sourceIndex;

            for (i = 0; i < n; i += 4) {
                sourceIndex = (i/4) * 3;
                containerPixels[i  ] = ((containerPixels[i  ] >> 1) << 1) | parseInt(bitStringToHide.charAt(sourceIndex  ));
                containerPixels[i+1] = ((containerPixels[i+1] >> 1) << 1) | parseInt(bitStringToHide.charAt(sourceIndex+1));
                containerPixels[i+2] = ((containerPixels[i+2] >> 1) << 1) | parseInt(bitStringToHide.charAt(sourceIndex+2));
            }

            return {
                containerData: containerData,
                usedBits: bitStringToHide.length
            }

        };


    self.postMessage(_hideText(data));

}, false);
