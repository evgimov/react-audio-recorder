export default AudioContext || webkitAudioContext;

export const unlock: (context: AudioContext) => Promise<{}>
= async (context) => {
    return await new Promise(function (resolve, reject)
    {
        console.log("context.state: ", context.state);
        if (context.state === 'suspended' && 'ontouchstart' in window) {
            var _unlock = function() {
                console.log("_unlock()");
                context.resume().then(function()
                {
                    console.log("context.resume() SUCCESS");
                    document.body.removeEventListener('touchstart', _unlock);
                    document.body.removeEventListener('touchend', _unlock);

                    resolve(true);
                }, 
                function (reason) {
                    console.log("context.resume() Failure:", reason);
                    reject(reason);
                });
            };

            console.log(`document.body.addEventListener('touchstart', _unlock, false);`);
            console.log(`document.body.addEventListener('touchend', _unlock, false);`);
            document.body.addEventListener('touchstart', _unlock, false);
            document.body.addEventListener('touchend', _unlock, false);
        } else {
            console.log('Not calling _unlock()');
            resolve(false);
        }
    });
}