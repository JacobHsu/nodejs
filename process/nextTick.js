/*
 * http://howtonode.org/understanding-process-next-tick
 */

//process.nextTick
function foo() {
    console.error('foo');
}
 
process.nextTick(foo);
console.error('bar');


//setTimeout
//setTimeout(foo, 0);
//console.log('bar');