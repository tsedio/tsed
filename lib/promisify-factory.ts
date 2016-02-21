import Promise = require('bluebird');
/**
 *
 * @param targetClass
 * @param originalMethod
 * @returns {function(Express.Request, Express.Response, Function): Promise<U>|Promise<U|U>}
 */
export function PromisifyFactory(targetClass, originalMethod){

    return function (request:any, response:any, next:Function) {

        return new Promise<any>((resolve, reject) =>{
            response.resolve = resolve;
            response.reject = reject;

            try{
                var returnedValue = originalMethod.call(targetClass, request, response, next);
            }catch(er){
                reject(er);
            }

            if(returnedValue){
                if(returnedValue.then){
                    returnedValue.then(resolve, reject);
                }else{
                    resolve(returnedValue);
                }
            }

        })
            .then(function(data){

                if(data){
                    switch(request.method){
                        case 'POST':

                            response.status(201);
                            response.location(request.path + '/' + data._id);
                            response.json(data);

                            break;

                        default:
                            response.setHeader('Content-Type', 'text/json');
                            response.status(200);
                            response.json(data);
                            break;
                    }
                }

            })

            .catch(function(err){
                next(err);
            });
    }
}