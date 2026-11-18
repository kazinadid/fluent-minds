// Verify form delivery branches and shared navigation without sending a message.
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../assets/site.js',import.meta.url),'utf8');
function element(extra={}) {
 const classes=new Set();
 return Object.assign({events:{},attrs:{},style:{},hidden:false,textContent:'',
  classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c),toggle(c,force){const on=force??!classes.has(c);if(on)classes.add(c);else classes.delete(c);return on;}},
  setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.events[k]=fn;},focus(){this.focused=true;}
 },extra);
}
function setup({form=null,nav=null,print=[]}={}) {
 let timer=null,printed=0;
 const nodes={contactForm:form,subject:form?.select,successMsg:form?.status};
 const document={documentElement:element(),querySelector:sel=>sel==='body > nav'?nav:null,
  querySelectorAll:sel=>sel==='[data-print]'?print:[],getElementById:id=>nodes[id]??null,createElement:()=>element()};
 const context={document,location:new URL('https://fluent-minds.netlify.app/contact.html?subject=Request+a+Resource'),URL,URLSearchParams,AbortController,
  history:{replaceState(){}},window:{print(){printed++;}},setTimeout(fn){timer=fn;return 1;},clearTimeout(){timer=null;},
  FormData:class {constructor(f){return Object.entries(f.values);}},fetch:async()=>({ok:true})};
 vm.runInNewContext(source,context);
 return {context,timer:()=>timer,printed:()=>printed};
}
function formFixture(){
 const button=element({disabled:false});const status=element();
 const select={options:[{value:'Request a Resource'}],value:''};
 return element({button,status,select,values:{'form-name':'contact','first-name':'Test',email:'test@example.invalid',message:'Local fixture; never sent.'},resets:0,
  querySelector:()=>button,reportValidity:()=>true,reset(){this.resets++;this.values.message='';}});
}
const form=formFixture();const env=setup({form});
assert.equal(form.select.value,'Request a Resource');
let posted;
env.context.fetch=async(url,options)=>{posted={url,options};return {ok:true};};
await form.events.submit({preventDefault(){}});
assert.equal(posted.url,'/');assert.equal(posted.options.method,'POST');
assert.equal(new URLSearchParams(posted.options.body).get('form-name'),'contact');
assert.equal(form.resets,1);assert.match(form.status.textContent,/has been sent/);assert.equal(form.button.disabled,false);
for(const failure of ['server','network','timeout']) {
 form.values.message='Preserve this message';const before=form.resets;
 if(failure==='server')env.context.fetch=async()=>({ok:false});
 if(failure==='network')env.context.fetch=async()=>{throw new Error('offline');};
 if(failure==='timeout')env.context.fetch=async(_url,options)=>new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new Error('aborted'))));
 const submission=form.events.submit({preventDefault(){}});
 if(failure==='timeout'){assert.equal(form.button.disabled,true);env.timer()();}
 await submission;
 assert.equal(form.resets,before);assert.equal(form.values.message,'Preserve this message');
 assert.match(form.status.textContent,/could not confirm delivery/);assert.equal(form.button.disabled,false);
}
const links=element({querySelectorAll:()=>[link]});const link=element({pathname:'/contact.html'});
const nav=element({querySelector:()=>links,insertBefore(button){this.button=button;}});
const print=element();const shared=setup({nav,print:[print]});
assert.equal(link.attrs['aria-current'],'page');
nav.button.events.click();assert.equal(nav.button.attrs['aria-expanded'],'true');assert.equal(links.classList.contains('is-open'),true);
nav.events.keydown({key:'Escape'});assert.equal(nav.button.attrs['aria-expanded'],'false');assert.equal(nav.button.focused,true);
nav.button.events.click();link.events.click();assert.equal(nav.button.attrs['aria-expanded'],'false');
print.events.click();assert.equal(shared.printed(),1);
console.log('PASS: form encoding, successful delivery, server/network/timeout failures with retained input, subject selection, menu open/Escape/link-close, and print action. No network request sent.');
