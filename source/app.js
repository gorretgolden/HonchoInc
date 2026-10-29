/* ---------- Helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtN=n=>Math.round(n).toLocaleString('en-US');
const ugx=n=>'UGX '+fmtN(n);
const ugxC=n=>{const a=Math.abs(n);if(a>=1e9)return 'UGX '+(n/1e9).toFixed(2)+'B';if(a>=1e6)return 'UGX '+(n/1e6).toFixed(1)+'M';if(a>=1e3)return 'UGX '+Math.round(n/1e3)+'K';return 'UGX '+fmtN(n)};
const usd=n=>'USD '+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const usd0=n=>'USD '+Math.round(n).toLocaleString('en-US');
const pad=n=>String(n).padStart(2,'0');
const TODAY=new Date();TODAY.setHours(0,0,0,0);
const addD=n=>{const d=new Date(TODAY);d.setDate(d.getDate()+n);return d};
const fD=d=>new Date(d).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
const daysTo=d=>Math.round((new Date(d)-TODAY)/864e5);
const nowHM=()=>{const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())};
const nextHour=()=>{const h=Math.min(21,new Date().getHours()+1);return pad(h)+':00'};
const listJoin=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
let uid=100;const nid=()=>++uid;
const one=u=>({pcs:'piece',pairs:'pair',kits:'kit',boxes:'box',rolls:'roll',sets:'set',packs:'pack'}[u]||u);
const packW=p=>({ctn:'cartons',pallet:'pallets',bundle:'bundles'}[p]||p+'s');

const IC={home:'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',ship:'M2 16h20l-2.6 4.5H4.6zM5 16v-4h4v4M9 16V9h4v7M13 16v-4h4v4M18 16V8h2',check:'M8.5 12.5l2.5 2.5 5-5.5M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',box:'M21 7.5 12 3 3 7.5l9 4.5zM3 7.5v9L12 21l9-4.5v-9M12 12v9',chat:'M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20.5l1.6-5A8.5 8.5 0 1 1 21 11.5z',mega:'M3 10v4h3l6 4V6L6 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',cal:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 15.5l2 2 4-4',palette:'M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.5-.2-.8-.5-1.2a1.5 1.5 0 0 1 1.1-2.5H16a5 5 0 0 0 5-5C21 6.5 17 3 12 3zM7.5 12h.01M9.5 7.5h.01M14.5 7.5h.01',bell:'M18 8.5a6 6 0 0 0-12 0c0 7-3 8.5-3 8.5h18s-3-1.5-3-8.5M13.7 21a2 2 0 0 1-3.4 0',plus:'M12 5v14M5 12h14',x:'M18 6 6 18M6 6l12 12',copy:'M9 9h11v11H9zM5 15H4V4h11v1',upload:'M12 15V4M7.5 8.5 12 4l4.5 4.5M4 19h16',arrow:'M5 12h14M13 6l6 6-6 6',loop:'M20 11a8 8 0 0 0-14.3-4.9L4 8M4 3v5h5M4 13a8 8 0 0 0 14.3 4.9L20 16M20 21v-5h-5',plane:'M21 15.5v-2l-8-5V4a1.5 1.5 0 0 0-3 0v4.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z',send:'M22 2 11 13M22 2l-7 20-4-9-9-4z',trash:'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',image:'M4 5h16v14H4zM4 15l4-4 5 5 3-3 4 4M15.5 9.5h.01',doc:'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',spark:'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6'};
const ic=(n,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[n]}"/></svg>`;

/* ---------- Trader types ---------- */
// product: [name, sku, pack, perPack, unit, fobUSD, sellUGX, stock, reorderAt, sold30d]
const PRESETS={
 electronics:{label:'Electronics & Phones',market:'Kikuubo',city:'Shenzhen',supplier:'Huaqiang Bei Trading Co.',contact:'Mr. Chen Wei',zh:'陈先生',wechat:'chenwei_hqb',s2:'sea',products:[
  ['Smart TV 32 inch','TV-32S','ctn',1,'pcs',58,520000,14,20,46],['Power bank 20,000mAh','PB-20K','ctn',50,'pcs',4.2,45000,380,200,410],['Bluetooth speaker','BS-X6','ctn',24,'pcs',6.8,65000,96,120,140],['Fast charger 20W','FC-20W','ctn',100,'pcs',1.1,15000,1200,500,860],['Wireless earbuds','EB-T5','ctn',60,'pcs',3.5,40000,0,150,230],['Solar home kit','SK-40','ctn',4,'kits',39,350000,22,15,18],['Smartwatch','SW-M2','ctn',40,'pcs',7.5,85000,64,80,96],['Extension socket 4-way','ES-4W','ctn',50,'pcs',1.9,20000,540,300,380]]},
 fashion:{label:'Fashion & Shoes',market:'Owino',city:'Guangzhou',supplier:'Baiyun Leather & Garments',contact:'Ms. Lin Mei',zh:'林女士',wechat:'linmei_baiyun',s2:'air',products:[
  ['Men leather loafers','ML-LF','ctn',12,'pairs',9.5,95000,30,48,70],['Ladies block heels','LB-H7','ctn',12,'pairs',8,85000,120,60,90],['Kids sneakers','KS-22','ctn',24,'pairs',4.2,45000,40,96,150],['Men denim jeans','DJ-M32','ctn',50,'pcs',5.5,55000,260,120,210],['Ladies maxi dress','LD-MX','ctn',60,'pcs',4.8,60000,0,90,160],['Handbags assorted','HB-AS','ctn',30,'pcs',6.2,70000,110,60,85],['Men polo shirts','PS-M','ctn',100,'pcs',2.6,30000,150,300,420],['School shoes black','SS-BK','ctn',24,'pairs',5,50000,420,200,310]]},
 hardware:{label:'Hardware & Building',market:'Ndeeba',city:'Foshan',supplier:'Foshan Ceramic & Hardware Co.',contact:'Mr. Zhang Lei',zh:'张先生',wechat:'zhanglei_fs',s2:'sea',products:[
  ['Floor tiles 60x60','FT-6060','pallet',48,'boxes',6.5,48000,30,96,180],['PPR pipe 25mm','PP-25','bundle',25,'pcs',1.4,12000,600,300,450],['Door lock set','DL-S3','ctn',20,'sets',5.5,55000,25,60,80],['Chrome water tap','WT-C1','ctn',50,'pcs',2.2,25000,340,150,220],['Electric cable 2.5mm 100m','EC-25','ctn',10,'rolls',18,160000,0,30,45],['LED bulb 12W','LB-12','ctn',100,'pcs',0.45,6000,1500,800,1100],['Wheelbarrow','WB-65','ctn',2,'pcs',16,140000,8,20,26],['Door hinges 4 inch','DH-4','ctn',200,'pairs',0.3,4000,2400,1000,1600]]},
 beauty:{label:'Beauty & Cosmetics',market:'Kampala Road',city:'Guangzhou',supplier:'Baiyun Beauty Supplies',contact:'Ms. Huang Yan',zh:'黄女士',wechat:'huangyan_beauty',s2:'air',products:[
  ['Braiding hair expression','BH-EX','ctn',100,'packs',0.9,10000,350,500,900],['Human hair wig 18 inch','HW-18','ctn',20,'pcs',28,280000,40,20,30],['Lip gloss set','LG-6','ctn',120,'sets',0.8,10000,120,240,380],['Gel nail polish','GN-12','ctn',200,'pcs',0.6,8000,900,400,650],['Hair dryer 2000W','HD-20','ctn',12,'pcs',9,90000,0,24,40],['Makeup brush set','MB-12','ctn',50,'sets',2.5,30000,140,80,110],['Lashes 5 pair','EL-5P','ctn',300,'packs',0.5,8000,200,600,900],['Salon chair','SC-01','ctn',1,'pcs',95,1100000,6,3,4]]},
 spares:{label:'Auto Spare Parts',market:'Kisekka',city:'Guangzhou',supplier:'Guangzhou Auto Parts City',contact:'Mr. Liu Yang',zh:'刘先生',wechat:'liuyang_autoparts',s2:'sea',products:[
  ['Brake pads Toyota','BP-TY','ctn',40,'sets',4,60000,30,80,120],['Oil filter','OF-90','ctn',100,'pcs',0.9,15000,700,300,520],['Shock absorbers','SA-PR','ctn',4,'pairs',22,250000,6,12,20],['Spark plugs 4-pack','SP-4','ctn',50,'packs',3,40000,260,120,180],['Car battery 70Ah','CB-70','ctn',1,'pcs',38,380000,0,15,24],['Headlamp Premio','HL-PR','ctn',6,'pcs',28,320000,30,12,18],['Motorcycle tyre 3.00-17','MT-317','ctn',10,'pcs',9,95000,40,80,130],['Wiper blades','WB-PR','ctn',100,'pairs',1.2,20000,900,300,400]]},
 home:{label:'Household & Kitchen',market:'Kikuubo',city:'Yiwu',supplier:'Yiwu Futian Homeware',contact:'Ms. Zhou Jing',zh:'周女士',wechat:'zhoujing_yiwu',s2:'sea',products:[
  ['Non-stick pan set 5pc','NP-5','ctn',6,'sets',14,160000,10,24,40],['Thermos flask 2L','TF-2L','ctn',24,'pcs',3.2,35000,300,120,200],['Plastic basins assorted','PB-AS','ctn',50,'pcs',0.9,10000,200,400,600],['Blender 2-in-1','BL-2','ctn',6,'pcs',11,120000,60,30,45],['Bedsheet set queen','BS-Q','ctn',40,'sets',4.5,55000,0,80,140],['Plate set 24pc','PL-24','ctn',4,'sets',9,110000,40,20,30],['Gas cooker 2-burner','GC-2','ctn',4,'pcs',13,150000,10,24,36],['Pedal dustbin 12L','DB-12','ctn',20,'pcs',2.1,25000,240,100,150]]}
};
const SEA=['Order placed','Deposit paid','In production','QC & loading','At sea','Mombasa port','On the road','URA clearance','Receiving','In stock'];
const AIR=['Order placed','Deposit paid','In production','QC & handover','Air cargo','Entebbe arrival','URA clearance','Receiving','In stock'];
const DOCS={sea:[['Proforma invoice (PI)',0],['Deposit TT slip',1],['Commercial invoice',3],['Packing list',3],['Bill of lading',4],['Transit docs, Malaba',6],['URA assessment',7],['Tax payment slip',7],['Release order',7],['Delivery note',8]],
 air:[['Proforma invoice (PI)',0],['Deposit TT slip',1],['Commercial invoice',3],['Packing list',3],['Air waybill',4],['URA assessment',6],['Tax payment slip',6],['Release order',6],['Delivery note',7]]};
const CHANNELS=['Instagram','Facebook','TikTok','WhatsApp Status'];
const PLANS=[{id:'kibanda',n:'Kibanda',p:'49,000',f:'Solo traders',x:['1 user','Shipments, goods matching and stock','2 social channels','English supplier messages']},
 {id:'duuka',n:'Duuka',p:'149,000',f:'Growing shops',x:['5 users with roles','All social channels and bookings','Push, WhatsApp and SMS promos','Personal assistant for the owner','English and Chinese supplier messages']},
 {id:'honcho',n:'Honcho',p:'390,000',f:'Wholesalers and importers',x:['Unlimited users and branches','Your own branded app on phones','Clearing agent and supplier portal','Mobile money booking deposits','Setup and staff training']}];

/* ---------- State ---------- */
const S={rate:3650,brand:{name:'HONCHO INC',owner:'Boss',tagline:'Wholesale and retail, direct from China',wa:'+256 700 000 114',color:null,logo:null,plan:'duuka',chan:{'WhatsApp Business':true,'Instagram':true,'Facebook Page':true,'TikTok':false,'SMS sender ID':true}},type:'electronics',ui:{}};
try{const sv=JSON.parse(localStorage.getItem('honcho.v1')||'null');if(sv){Object.assign(S.brand,sv.brand||{});if(PRESETS[sv.type])S.type=sv.type}}catch(e){}
function save(){try{localStorage.setItem('honcho.v1',JSON.stringify({brand:S.brand,type:S.type}))}catch(e){try{localStorage.setItem('honcho.v1',JSON.stringify({brand:{...S.brand,logo:null},type:S.type}))}catch(e2){}}}

const PR=()=>PRESETS[S.type];
const prod=id=>S.products[id];
const stages=s=>s.route==='air'?AIR:SEA;
const recv=s=>stages(s).indexOf('Receiving');
const ship=id=>S.shipments.find(s=>s.id===id);
const shipUSD=s=>s.items.reduce((a,l)=>{const p=prod(l.pid);return a+l.oc*p.per*p.fob},0);
const landed=p=>p.fob*S.rate*1.55;
const onOrder=pid=>S.shipments.filter(s=>!s.confirmed&&s.stage<=recv(s)).reduce((a,s)=>a+s.items.filter(l=>l.pid===pid).reduce((b,l)=>b+l.oc*prod(pid).per,0),0);
const incomingFor=pid=>S.shipments.find(s=>s.stage<recv(s)&&s.items.some(l=>l.pid===pid));
function nodeOf(s){const i=s.stage;if(s.route==='air'){return i<=3?0:i===4?1:i===5?2:i===6?4:5}return i<=3?0:i===4?1:i===5?2:i===6?3:i===7?4:5}
function stageTone(s){if(s.stage>=stages(s).length-1)return 'ok';if(s.stage===recv(s))return 'warn';return nodeOf(s)===0?'mute':'info'}
function stageDate(s,i){const n=recv(s);return new Date(s.ordered.getTime()+(s.eta-s.ordered)*Math.min(i,n)/n)}
const yymm=d=>String(d.getFullYear()).slice(2)+pad(d.getMonth()+1);
function mkShip(o){const s=Object.assign({id:nid(),confirmed:false,balancePaid:true,balanceDue:null},o);s.docs={};DOCS[s.route].forEach(d=>s.docs[d[0]]=s.stage>d[1]);return s}
function initials(){const w=S.brand.name.trim().split(/\s+/).filter(x=>!/^(inc|ltd|co|limited|ug|u|enterprises|company|&)$/i.test(x.replace(/[().]/g,'')));return ((w[0]||'H')[0]+(w[1]?w[1][0]:'')).toUpperCase()}
function logoHTML(cls=''){return `<span class="logo ${cls}">${S.brand.logo?`<img src="${S.brand.logo}" alt="">`:`<span>${esc(initials())}</span>`}</span>`}

function seed(type){
 S.type=type;const P=PR();
 S.products=P.products.map((r,i)=>({id:i,name:r[0],sku:r[1],pack:r[2],per:r[3],unit:r[4],fob:r[5],sell:r[6],stock:r[7],reorder:r[8],sold:r[9]}));
 const ctn=i=>{const p=prod(i);return Math.min(60,Math.max(2,Math.round(p.sold*1.5/p.per)))};
 const s1=[0,1,3,5,7,6].map(i=>({pid:i,oc:ctn(i),rc:null,dc:0}));
 [0,-2,0,1,0,null].forEach((a,k)=>{s1[k].rc=a===null?null:Math.max(0,s1[k].oc+a)});s1[4].dc=1;
 const air=P.s2==='air';
 S.shipments=[
  mkShip({ref:'HON-'+yymm(addD(-62))+'-07',route:'sea',stage:8,items:s1,cno:'MSKU 482913 7',bl:'BL GZMBA0098812',via:'Nansha to Mombasa, truck via Malaba',ordered:addD(-62),eta:addD(-1)}),
  mkShip({ref:'HON-'+yymm(addD(air?-16:-40))+'-11',route:P.s2,stage:6,items:[2,6,5].map(i=>({pid:i,oc:ctn(i),rc:null,dc:0})),cno:air?'AWB 176-48291037':'TGHU 771204 9',bl:air?'Flight CAN to EBB':'BL GZMBA0101433',via:air?'Guangzhou Baiyun to Entebbe':'Nansha to Mombasa, truck via Malaba',ordered:addD(air?-16:-40),eta:addD(air?2:6)}),
  mkShip({ref:'HON-'+yymm(addD(-9))+'-14',route:'sea',stage:2,items:[1,3,7].map(i=>({pid:i,oc:ctn(i),rc:null,dc:0})),cno:'Not booked yet',bl:'Pending',via:'Nansha to Mombasa, truck via Malaba',ordered:addD(-9),eta:addD(48),balancePaid:false,balanceDue:addD(12)})
 ];
 const s2=S.shipments[1],s3=S.shipments[2];const nm=i=>prod(i).name;
 S.inquiries=[
  {id:nid(),ch:'WhatsApp',name:'Aisha K.',pid:0,t:'9:12',status:'new',msgs:[{f:'them',x:`Hello, is the ${nm(0)} available? I need 3 for my shop in Mukono.`}]},
  {id:nid(),ch:'Instagram',name:'@gulu.mart',pid:6,t:'8:47',status:'new',msgs:[{f:'them',x:`How much is wholesale for ${nm(6)}? Do you send to Gulu?`}]},
  {id:nid(),ch:'Facebook',name:'Grace N.',pid:2,t:'Yesterday',status:'new',msgs:[{f:'them',x:`Can I book 2 ${packW(prod(2).pack)} of ${nm(2)} from the shipment that is coming? I can pay a deposit today.`}]},
  {id:nid(),ch:'TikTok',name:'Brian O.',pid:4,t:'Yesterday',status:'new',msgs:[{f:'them',x:`Saw your video. When is ${nm(4)} coming back?`}]},
  {id:nid(),ch:'WhatsApp',name:'Okello J.',pid:1,t:'Mon',status:'replied',msgs:[{f:'them',x:'Please send me your price list.'},{f:'me',x:'Sent the price list. Call us anytime.'}]},
  {id:nid(),ch:'Instagram',name:'Nalubega S.',pid:5,t:'Mon',status:'booked',msgs:[{f:'them',x:`Is the price for ${nm(5)} negotiable?`},{f:'me',x:'For 2 and above we give a discount. I have booked them for you.'}]}];
 const bk=(name,ch,pid,mult)=>{const p=prod(pid);const qty=Math.max(1,p.per*mult);return {id:nid(),name,ch,pid,qty,deposit:Math.round(qty*p.sell*.3/1000)*1000,sid:s2.id,done:false}};
 S.bookings=[bk('Mama Shakira','WhatsApp',2,2),bk('Ssekandi D.','Instagram',6,1),bk('Nalubega S.','Instagram',5,.5)];
 S.tasks=[
  {id:nid(),t:'07:30',x:`Call clearing agent about ${s2.cno}`,c:'Clearing',w:'Me',done:true,day:'Today'},
  {id:nid(),t:'09:00',x:`Brief shop team on counting ${S.shipments[0].cno}`,c:'Business',w:'Shop manager',done:false,day:'Today'},
  {id:nid(),t:'10:30',x:`WeChat call with ${P.contact} about new samples`,c:'Supplier',w:'Me',done:false,day:'Today'},
  {id:nid(),t:'12:00',x:`Pay URA taxes for ${s2.ref} at the bank`,c:'Money',w:'Me',done:false,day:'Today'},
  {id:nid(),t:'14:00',x:'Reply to social media inquiries',c:'Customers',w:'Shop manager',done:false,day:'Today'},
  {id:nid(),t:'16:30',x:'Pick up the children from school',c:'Personal',w:'Me',done:false,day:'Today'},
  {id:nid(),t:'19:00',x:'Chama meeting, bring monthly contribution',c:'Personal',w:'Me',done:false,day:'Today'},
  {id:nid(),t:'08:30',x:`Confirm 70% balance plan for ${s3.ref} with ${P.contact}`,c:'Money',w:'Me',done:false,day:'Tomorrow'}];
 const nm1=new Date(TODAY.getFullYear(),TODAY.getMonth()+1,1);
 S.pays=[{id:nid(),x:`Clearing agent fees · ${s2.ref}`,amt:ugx(2450000),due:addD(2),paid:false},{id:nid(),x:'Shop rent',amt:ugx(1800000),due:nm1,paid:false},{id:nid(),x:'Staff wages, 3 people',amt:ugx(1350000),due:addD(Math.max(1,daysTo(nm1)-1)),paid:false}];
 S.notifs=[{title:'Container at your store',body:`${S.shipments[0].cno} was released by URA and delivered. Count the cartons.`,t:'1 hr ago',unread:true},{title:'Booking request',body:'Grace N. wants to book goods on Facebook.',t:'Yesterday',unread:true},{title:'Shipment update',body:`${s2.ref} moved to ${stages(s2)[s2.stage]}.`,t:'Yesterday',unread:false}];
 S.posts=[{id:nid(),pid:0,ch:['Instagram','WhatsApp Status'],when:'Yesterday',views:1840,inq:12,img:null},{id:nid(),pid:2,ch:['Facebook','TikTok'],when:'Mon',views:3120,inq:9,img:null}];
 S.sent=[{title:'Weekend wholesale prices',aud:'Wholesale buyers',reach:186,ch:['WhatsApp broadcast','SMS'],when:'Sat 9:00',status:'Sent'}];
 S.autos=[{id:'a1',on:true,t:'When a shipment reaches the port or URA, tell customers who booked'},{id:'a2',on:true,t:'When goods enter stock, draft a "New arrivals" post for all socials'},{id:'a3',on:false,t:'Every Friday at 9:00, send the wholesale price list to wholesale buyers'},{id:'a4',on:true,t:'When an item falls below its reorder level, remind me to reorder'}];
 S.ui={view:S.ui.view||'today',shipFilter:'all',open:{},matchSid:null,stockTab:'list',sel:new Set(),socialTab:'create',inq:null,bkOpen:false,paF:'all',sugDone:new Set(),
  soc:{pid:0,img:null,ch:{Instagram:true,Facebook:true,TikTok:false,'WhatsApp Status':true},prev:'feed',price:true,preorder:false,wm:true,v:0,caption:''},
  push:{type:'arrivals',title:'',body:'',aud:'all',ch:{'App push':true,'WhatsApp broadcast':true,'SMS':false,'Instagram story':false,'Facebook page':false},when:'now'},calc:{}};
 S.ui.soc.caption=caption();setPushType('arrivals');calcFromProduct(0);
}

/* ---------- Brand ---------- */
function lum(hex){const h=hex.replace('#','');const c=[0,2,4].map(i=>{let v=parseInt(h.substr(i,2),16)/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function mixWhite(hex,t){const h=hex.replace('#','');const c=[0,2,4].map(i=>parseInt(h.substr(i,2),16));return '#'+c.map(v=>pad(Math.round(v+(255-v)*t).toString(16))).join('')}
function applyBrand(){const B=S.brand,r=document.documentElement.style;
 if(B.color&&/^#[0-9a-f]{6}$/i.test(B.color)){const dk=lum(B.color)<.18?mixWhite(B.color,.42):B.color;r.setProperty('--brand',B.color);r.setProperty('--brand-dark',dk);r.setProperty('--on-brand',lum(B.color)>.45?'#0B1412':'#FFFFFF');r.setProperty('--on-brand-dark',lum(dk)>.4?'#0B1412':'#FFFFFF')}
 else ['--brand','--brand-dark','--on-brand','--on-brand-dark'].forEach(k=>r.removeProperty(k));
 document.querySelectorAll('[data-brand-logo]').forEach(el=>el.innerHTML=logoHTML());
 document.querySelectorAll('[data-brand-name]').forEach(el=>el.textContent=B.name||'Your business');
 document.querySelectorAll('[data-brand-tag]').forEach(el=>el.textContent=B.tagline);
 const pn=$('#planName');if(pn)pn.textContent=PLANS.find(p=>p.id===B.plan).n;
 save()}

/* ---------- Shell ---------- */
const NAV=[['today','Today','home','Today'],['shipments','Shipments','ship','Ships'],['matching','Goods matching','check','Match'],['stock','Stock & costs','box','Stock'],['social','Social & bookings','chat','Social'],['push','Push & promos','mega','Push'],['assistant','My assistant','cal','My day'],['brand','Brand & plan','palette','Brand']];
function badgeFor(v){if(v==='matching')return S.shipments.filter(s=>s.stage===recv(s)&&!s.confirmed).length;if(v==='social')return S.inquiries.filter(q=>q.status==='new').length;if(v==='assistant')return S.tasks.filter(t=>!t.done&&t.day==='Today').length;return 0}
function navRender(){const v=S.ui.view;
 $('#nav').innerHTML=NAV.map(n=>{const b=badgeFor(n[0]);return `<button class="nav-i" data-act="go" data-go="${n[0]}" ${v===n[0]?'aria-current="page"':''}>${ic(n[2])}<span>${n[1]}</span>${b?`<span class="badge">${b}</span>`:''}</button>`}).join('');
 $('#bnav').innerHTML=NAV.map(n=>{const b=badgeFor(n[0]);return `<button data-act="go" data-go="${n[0]}" ${v===n[0]?'aria-current="page"':''}>${ic(n[2])}<span>${n[3]}</span>${b?`<span class="badge">${b}</span>`:''}</button>`}).join('');
 const un=S.notifs.filter(n=>n.unread).length;
 $('#top').innerHTML=`<div class="mob-brand"><span data-brand-logo>${logoHTML('sm')}</span><b data-brand-name>${esc(S.brand.name)}</b></div>
 <div class="top-r"><label class="top-sel"><span class="sr">Business type</span><select id="typeSel" data-ch="type">${Object.entries(PRESETS).map(([k,p])=>`<option value="${k}" ${k===S.type?'selected':''}>${p.label}</option>`).join('')}</select></label>
 <button class="iconbtn" data-act="bell" aria-label="Notifications, ${un} unread">${ic('bell')}${un?`<span class="badge dotc">${un}</span>`:''}</button></div>`;
 document.querySelectorAll('.mob-brand [data-brand-logo]').forEach(el=>el.innerHTML=logoHTML('sm'))}
function render(){$('#view').innerHTML=VIEWS[S.ui.view]();navRender()}
function afterNav(){const id=S.ui.scrollTo;S.ui.scrollTo=null;const el=id&&$('#ship-'+id);if(el)el.scrollIntoView({block:'center'});else window.scrollTo(0,0)}
function setView(v){if(!VIEWS[v])v='today';S.ui.view=v;if(location.hash.slice(1)!==v){try{location.hash=v}catch(e){render();afterNav()}}else{render();afterNav()}}
window.addEventListener('hashchange',()=>{const v=location.hash.slice(1);S.ui.view=VIEWS[v]?v:'today';render();afterNav()});
function vh(eyebrow,title,sub,actions=''){return `<div class="vh"><div style="min-width:0"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${sub?`<p class="sub">${sub}</p>`:''}</div>${actions?`<div class="row">${actions}</div>`:''}</div>`}

/* ---------- Today ---------- */
function vToday(){
 const B=S.brand,P=PR(),h=new Date().getHours(),g=h<12?'Good morning':h<17?'Good afternoon':'Good evening';
 const moving=S.shipments.filter(s=>s.stage<recv(s)),atR=S.shipments.filter(s=>s.stage===recv(s)&&!s.confirmed);
 const low=S.products.filter(p=>p.stock<p.reorder),open=S.inquiries.filter(q=>q.status==='new');
 const transit=moving.reduce((a,s)=>a+shipUSD(s),0),stockVal=S.products.reduce((a,p)=>a+p.stock*landed(p),0);
 const waiting=S.bookings.filter(b=>!b.done&&b.sid&&!ship(b.sid).confirmed),dep=S.bookings.filter(b=>!b.done).reduce((a,b)=>a+b.deposit,0);
 const needs=[];
 atR.forEach(s=>{const m=matchSum(s);needs.push([m.issues?'bad':'warn','Goods check',`Count ${s.cno}: ${m.counted} of ${m.total} lines counted, ${m.issues} with differences so far.`,'Start count',`data-act="match" data-id="${s.id}"`])});
 S.shipments.filter(s=>!s.balancePaid).forEach(s=>needs.push([daysTo(s.balanceDue)<=7?'warn':'info','Payment',`Supplier balance ${usd0(shipUSD(s)*.7)} for ${s.ref} due ${fD(s.balanceDue)}, in ${daysTo(s.balanceDue)} days.`,'Mark paid',`data-act="payBal" data-id="${s.id}"`]));
 if(low.length)needs.push(['warn','Stock',`${low.length} items below reorder level: ${listJoin(low.slice(0,3).map(p=>p.name))}.`,'Reorder','data-act="reorder"']);
 if(open.length)needs.push(['info','Customers',`${open.length} social inquiries are waiting for a reply.`,'Reply','data-act="go" data-go="social" data-tab="inbox"']);
 if(waiting.length)needs.push(['info','Bookings',`${waiting.length} customers booked goods on incoming shipments. Keep them updated.`,'Send update','data-act="pushPreset" data-p="update"']);
 const tasks=S.tasks.filter(t=>t.day==='Today').sort((a,b)=>a.t.localeCompare(b.t)).filter(t=>!t.done).slice(0,5);
 const brief=`${moving.length} shipments on the way${atR.length?`, ${atR.length} at your store waiting to be counted`:''}. ${low.length} items running low and ${open.length} customers waiting for a reply.`;
 return vh(`${fD(new Date())} · ${esc(P.label)} · ${esc(P.market)}`,`${g}, ${esc(B.owner)}`,brief,`<button class="btn" data-act="go" data-go="assistant">${ic('cal')}Open my day</button><button class="btn pri" data-act="reorder">${ic('plus')}New China order</button>`)+`
 <section class="kpis" aria-label="Summary">
  <div class="kpi"><small>Goods on the way</small><b>${usd0(transit)}</b><small>${moving.length} shipments from ${esc(P.city)}</small></div>
  <div class="kpi"><small>Stock value</small><b>${ugxC(stockVal)}</b><small>at landed cost</small></div>
  <div class="kpi"><small>New inquiries</small><b>${open.length}</b><small>from WhatsApp, Instagram, Facebook, TikTok</small></div>
  <div class="kpi"><small>Booking deposits held</small><b>${ugxC(dep)}</b><small>${S.bookings.filter(b=>!b.done).length} customers waiting for goods</small></div>
 </section>
 <section class="card" style="margin-top:16px"><div class="ch"><h2>Where your goods are</h2><span class="small muted">China to your store, then back to China</span></div>${routeStrip()}</section>
 <div class="grid g2">
  <section class="card"><div class="ch"><h2>Needs you today</h2><span class="pill mute">${needs.length} items</span></div><div class="needs">${needs.map(n=>`<div class="need"><span class="pill ${n[0]}">${n[1]}</span><p>${n[2]}</p><button class="btn sm" ${n[4]}>${n[3]}</button></div>`).join('')||'<p class="muted">Nothing urgent. Good day for sales.</p>'}</div></section>
  <section class="card"><div class="ch"><h2>Next on your day</h2><button class="btn sm ghost" data-act="go" data-go="assistant">All tasks ${ic('arrow')}</button></div><div class="tasks">${tasks.map(taskRow).join('')||'<p class="muted">All done for today.</p>'}</div></section>
 </div>`}
function taskRow(t){return `<label class="task ${t.done?'done':''}"><input type="checkbox" data-ch="toggleTask" data-id="${t.id}" ${t.done?'checked':''}><span class="mono">${t.t}</span><span class="tx">${esc(t.x)}</span><span class="pill mute">${t.c}</span></label>`}
function routeStrip(){const P=PR();
 const nodes=[['China',P.city+' supplier'],['In transit','By sea or by air'],['Port or airport','Mombasa · Entebbe'],['Border & road','Malaba to Kampala'],['URA clearance','Kampala'],['Your store','Count, stock, sell']];
 const by=nodes.map(()=>[]);S.shipments.forEach(s=>by[nodeOf(s)].push(s));
 const low=S.products.filter(p=>p.stock<p.reorder).length;
 return `<div class="route" tabindex="0" aria-label="Shipment route"><ol class="route-in">${nodes.map((n,i)=>`<li class="rn ${by[i].length?'has':''}"><span class="rdot"></span><b>${n[0]}</b><small>${n[1]}</small><div class="rships">${by[i].map(s=>`<button class="rship" data-act="openShip" data-id="${s.id}">${ic(s.route==='air'?'plane':'ship')}<span class="mono">${s.ref}</span></button>`).join('')||'<span class="rnone">Nothing here</span>'}</div></li>`).join('')}
 <li class="rn loop"><span class="rdot"></span><b>Reorder</b><small>Back to ${esc(P.city)}</small><div class="rships"><button class="rship" data-act="reorder">${ic('loop')}<span>${low} items low</span></button></div></li></ol></div>`}

/* ---------- Shipments ---------- */
function vShipments(){
 const f=S.ui.shipFilter,grp=s=>{const n=nodeOf(s);return n===0?'china':n<5?'transit':'uganda'};
 const cnt=k=>k==='all'?S.shipments.length:S.shipments.filter(s=>grp(s)===k).length;
 const list=S.shipments.filter(s=>f==='all'||grp(s)===f);
 return vh('China to Kampala','Shipments','Every order from proforma invoice to your shelf. Tap a stage to move it on and the right people get told.',`<button class="btn pri" data-act="reorder">${ic('plus')}New China order</button>`)+`
 <div class="fchips" role="group" aria-label="Filter shipments">${[['all','All'],['china','In China'],['transit','On the way'],['uganda','In Uganda']].map(([k,l])=>`<button class="fchip" data-act="shipFilter" data-f="${k}" aria-pressed="${f===k}">${l} · ${cnt(k)}</button>`).join('')}</div>
 <div class="ships">${list.map(shipCard).join('')||'<div class="card empty"><h2>No shipments here</h2><p class="muted">Try another filter.</p></div>'}</div>`}
function shipCard(s){const st=stages(s),open=S.ui.open[s.id],P=PR(),ctn=s.items.reduce((a,l)=>a+l.oc,0),rv=recv(s);
 const eta=s.stage>=rv?(s.confirmed?'Received and in stock':'At your store, count it'):`ETA Kampala ${fD(s.eta)} · ${daysTo(s.eta)} days`;
 return `<article class="card ship" id="ship-${s.id}"><header class="ship-h"><div class="ship-id"><span class="route-ic">${ic(s.route==='air'?'plane':'ship')}</span><div><div class="mono strong">${s.ref}</div><div class="small muted">${esc(P.supplier)} · ${s.route==='air'?'Air cargo':'Sea freight'}</div></div></div>
 <div class="ship-meta"><span><small>${s.route==='air'?'Air waybill':'Container'}</small><b class="mono">${s.cno}</b></span><span><small>Packages</small><b>${ctn}</b></span><span><small>Goods value</small><b>${usd0(shipUSD(s))}</b></span></div></header>
 <div class="track" role="img" aria-label="Stage ${s.stage+1} of ${st.length}: ${st[s.stage]}">${st.map((n,i)=>`<span class="${i<s.stage?'done':i===s.stage?'now':''}" title="${n}"></span>`).join('')}</div>
 <div class="ship-now"><span class="pill ${stageTone(s)}">${st[s.stage]}</span><span class="small muted">Stage ${s.stage+1} of ${st.length} · ${eta}</span><button class="btn sm" data-act="toggleShip" data-id="${s.id}" aria-expanded="${!!open}">${open?'Hide details':'Details'}</button></div>
 ${open?shipDetail(s):''}</article>`}
function shipDetail(s){const st=stages(s),dl=DOCS[s.route],rv=recv(s),val=shipUSD(s),bk=S.bookings.filter(b=>b.sid===s.id&&!b.done),done=dl.filter(d=>s.docs[d[0]]).length;
 const acts=[];
 if(s.stage<rv)acts.push(`<button class="btn pri" data-act="advance" data-id="${s.id}">${ic('arrow')}Move to ${st[s.stage+1]}</button>`);
 if(s.stage===rv&&!s.confirmed)acts.push(`<button class="btn pri" data-act="match" data-id="${s.id}">${ic('check')}Open goods matching</button>`);
 if(bk.length&&!s.confirmed)acts.push(`<button class="btn" data-act="pushPreset" data-p="update" data-id="${s.id}">${ic('mega')}Update ${bk.length} customers</button>`);
 acts.push(`<button class="btn" data-act="reorderShip" data-id="${s.id}">${ic('loop')}Reorder these items</button>`);
 return `<div class="ship-d">
 <div><h3>Journey · ${esc(s.via)}</h3><ol class="vst">${st.map((n,i)=>`<li class="${i<s.stage?'done':i===s.stage?'now':''}"><span class="vd"></span><span>${n}</span><small class="mono">${i<=rv?fD(stageDate(s,i)):''}</small></li>`).join('')}</ol></div>
 <div><h3>Documents · ${done} of ${dl.length}</h3><div class="docs">${dl.map(d=>`<label class="doc"><input type="checkbox" data-ch="doc" data-id="${s.id}" data-doc="${esc(d[0])}" ${s.docs[d[0]]?'checked':''}><span>${d[0]}</span></label>`).join('')}</div><p class="small muted" style="margin:10px 0 0"><span class="mono">${esc(s.bl)}</span></p></div>
 <div><h3>Money</h3><dl class="kv"><dt>Goods value</dt><dd>${usd(val)}</dd><dt>Deposit 30%</dt><dd><span class="ok-t">Paid</span> · ${usd0(val*.3)}</dd><dt>Balance 70%</dt><dd>${s.balancePaid?`<span class="ok-t">Paid</span> · ${usd0(val*.7)}`:`<span class="warn-t">Due ${fD(s.balanceDue)}</span> · ${usd0(val*.7)}`}</dd><dt>Est. landed</dt><dd>${ugxC(val*S.rate*1.55)}</dd></dl>
 ${s.balancePaid?'':`<button class="btn sm" data-act="payBal" data-id="${s.id}" style="margin-bottom:14px">Mark balance paid</button>`}
 <h3>Goods</h3><ul class="glist">${s.items.map(l=>{const p=prod(l.pid);return `<li><span>${esc(p.name)}</span><span class="mono">${l.oc} ${p.pack}</span></li>`}).join('')}</ul>
 <h3>Customers who booked</h3><p class="small" style="margin:0">${bk.length?esc(listJoin(bk.map(b=>b.name))):'<span class="muted">None yet</span>'}</p></div></div>
 <div class="ship-act">${acts.join('')}</div>`}

/* ---------- Matching ---------- */
function matchSum(s){let counted=0,matched=0,short=0,exc=0,dmg=0,claim=0,issues=0,units=0;
 s.items.forEach(l=>{const p=prod(l.pid);if(l.rc==null)return;counted++;const sh=Math.max(0,l.oc-l.rc),ex=Math.max(0,l.rc-l.oc);short+=sh;exc+=ex;dmg+=l.dc;claim+=(sh+l.dc)*p.per*p.fob;units+=Math.max(0,l.rc-l.dc)*p.per;if(sh||ex||l.dc)issues++;else matched++});
 return {total:s.items.length,counted,matched,short,exc,dmg,claim,issues,units}}
function lineStatus(l){if(l.rc==null)return ['mute','Not counted'];const d=l.rc-l.oc,parts=[];let t='ok';if(d<0){parts.push(`Short ${-d}`);t='bad'}if(d>0){parts.push(`Extra ${d}`);if(t!=='bad')t='info'}if(l.dc>0){parts.push(`${l.dc} damaged`);if(t==='ok'||t==='info')t='warn'}return parts.length?[t,parts.join(' · ')]:['ok','Matched']}
function stepper(k,i,v,locked){return `<div class="step"><button data-act="stepv" data-k="${k}" data-i="${i}" data-d="-1" aria-label="Less" ${locked?'disabled':''}>−</button><input id="${k}-${i}" type="number" inputmode="numeric" min="0" value="${v??''}" placeholder="${k==='rc'?'Count':'0'}" data-ch="setv" data-k="${k}" data-i="${i}" aria-label="${k==='rc'?'Received':'Damaged'}" ${locked?'disabled':''}><button data-act="stepv" data-k="${k}" data-i="${i}" data-d="1" aria-label="More" ${locked?'disabled':''}>+</button></div>`}
function vMatching(){
 const cand=S.shipments.filter(s=>s.stage>=recv(s));
 if(!cand.length)return vh('Packing list vs what arrived','Goods matching','')+`<div class="card empty"><h2>No goods waiting to be counted</h2><p class="muted">When a shipment reaches your store it shows up here with the supplier's packing list.</p><button class="btn pri" data-act="go" data-go="shipments">See shipments</button></div>`;
 let s=ship(S.ui.matchSid);if(!s||!cand.includes(s))s=cand.find(x=>!x.confirmed)||cand[0];S.ui.matchSid=s.id;
 const m=matchSum(s),locked=s.confirmed,P=PR(),tot=s.items.reduce((a,l)=>a+l.oc,0);
 return vh('Packing list vs what arrived','Goods matching','Count each package against the supplier\'s packing list. Differences turn into a ready claim message in English or Chinese.')+`
 <section class="card"><div class="mhead"><div class="stack" style="gap:8px"><div class="field" style="max-width:420px"><label for="mSel">Shipment</label><select id="mSel" data-ch="mSel">${cand.map(x=>`<option value="${x.id}" ${x.id===s.id?'selected':''}>${x.ref} · ${x.cno}${x.confirmed?' · received':''}</option>`).join('')}</select></div>
 <div class="small muted">${esc(P.supplier)} · ${s.items.length} lines · ${tot} packages · packing list from ${esc(P.contact)}</div></div>
 <div class="stamp" aria-label="Shipping mark">${esc(S.brand.name)}<br>KLA · UGANDA<br>C/No. 1-${tot}<br>Made in China</div></div></section>
 <div class="msum" aria-label="Count summary"><div><small>Counted</small><b>${m.counted} of ${m.total} lines</b><div class="bar"><i style="width:${Math.round(m.counted/m.total*100)}%"></i></div></div><div><small>Matched</small><b class="ok-t">${m.matched}</b></div><div><small>Short packages</small><b class="bad-t">${m.short}</b></div><div><small>Damaged</small><b class="warn-t">${m.dmg}</b></div><div><small>Extra</small><b class="info-t">${m.exc}</b></div><div><small>Claim value</small><b>${usd(m.claim)}</b><small>${ugxC(m.claim*S.rate)}</small></div></div>
 ${locked?`<div class="notice">${ic('check','ok-t')}<div><b>Received and added to stock.</b><div class="small muted">${fmtN(m.units)} units are now on your shelves. Tell customers and post the new arrivals.</div><div class="row" style="margin-top:10px"><button class="btn sm pri" data-act="pushPreset" data-p="arrivals">${ic('mega')}Announce new stock</button><button class="btn sm" data-act="postItem" data-pid="${s.items[0].pid}">${ic('chat')}Create social post</button></div></div></div>`:''}
 <div class="mlist"><div class="mline mhd"><span>Item</span><span>Ordered</span><span>Received</span><span>Damaged</span><span>Status</span></div>
 ${s.items.map((l,i)=>{const p=prod(l.pid),[t,lab]=lineStatus(l),cl=l.rc==null?0:(Math.max(0,l.oc-l.rc)+l.dc)*p.per*p.fob;return `<div class="mline ${l.rc==null?'':t}">
  <div class="mi"><b>${esc(p.name)}</b><span class="mono muted">${p.sku} · ${p.per} ${p.unit} per ${p.pack}</span></div>
  <div><small>Ordered</small><b class="tnum">${l.oc} ${p.pack}</b><div class="small muted tnum">${fmtN(l.oc*p.per)} ${p.unit}</div></div>
  <div><small>Received</small>${stepper('rc',i,l.rc,locked)}</div>
  <div><small>Damaged</small>${stepper('dc',i,l.dc,locked)}</div>
  <div class="ms"><span class="pill ${t}">${lab}</span>${cl>0?`<span class="small muted tnum">${usd(cl)} to claim</span>`:''}${l.rc==null&&!locked?`<button class="btn sm" data-act="allHere" data-i="${i}">${ic('check')}All ${l.oc} here</button>`:''}</div></div>`}).join('')}</div>
 ${locked?'':`<div class="mfoot"><button class="btn" data-act="matchRest" ${m.counted===m.total?'disabled':''}>Mark the rest as correct</button><button class="btn" data-act="claim" data-id="${s.id}" ${m.issues?'':'disabled'}>${ic('send')}Message supplier about ${m.issues} differences</button><button class="btn pri" data-act="confirmRecv" data-id="${s.id}" ${m.counted<m.total?'disabled':''}>${ic('box')}Confirm and add to stock</button></div>`}`}
function claimText(s,lang){const P=PR(),B=S.brand,L=[];let tot=0;
 s.items.forEach(l=>{const p=prod(l.pid);if(l.rc==null)return;const sh=Math.max(0,l.oc-l.rc),ex=Math.max(0,l.rc-l.oc);
  if(sh){const v=sh*p.per*p.fob;tot+=v;L.push(lang==='zh'?`- ${p.name}（${p.sku}）：订购 ${l.oc} 箱，实收 ${l.rc} 箱，短少 ${sh} 箱（${sh*p.per} 件），金额 ${usd(v)}`:`- ${p.name} (${p.sku}): ordered ${l.oc} ${p.pack}, received ${l.rc}. Short ${sh} ${p.pack} (${sh*p.per} ${p.unit}), ${usd(v)}`)}
  if(l.dc){const v=l.dc*p.per*p.fob;tot+=v;L.push(lang==='zh'?`- ${p.name}（${p.sku}）：${l.dc} 箱破损（${l.dc*p.per} 件），金额 ${usd(v)}`:`- ${p.name} (${p.sku}): ${l.dc} ${p.pack} damaged (${l.dc*p.per} ${p.unit}), ${usd(v)}`)}
  if(ex)L.push(lang==='zh'?`- ${p.name}（${p.sku}）：多收 ${ex} 箱，请告知如何处理`:`- ${p.name} (${p.sku}): ${ex} extra ${p.pack} received. Please advise.`)});
 const doc=s.route==='air'?['AWB','运单号']:['container','柜号'];
 if(lang==='zh')return `${P.zh}您好，\n\n我们已在坎帕拉收到货物 ${s.ref}（${doc[1]} ${s.cno}），并已按照您的装箱单逐箱清点。\n\n发现以下差异：\n${L.join('\n')}\n\n索赔总额：${usd(tot)}\n\n请确认是在下一批货中补发，还是从我们的货款中扣减。破损纸箱的照片已附上。\n\n谢谢！\n${B.owner}，${B.name}`;
 return `Hello ${P.contact},\n\nWe received shipment ${s.ref} (${doc[0]} ${s.cno}) in Kampala and counted every package against your packing list.\n\nDifferences found:\n${L.join('\n')}\n\nTotal claim: ${usd(tot)}\n\nPlease confirm if you will send the missing goods with our next order or credit our account. Photos of the damaged cartons are attached.\n\nThank you,\n${B.owner}, ${B.name}`}
function claimHTML(){const s=ship(S.ui.claimSid),lang=S.ui.claimLang||'en',m=matchSum(s);
 return `<header class="mh"><div><div class="eyebrow">Claim · ${s.ref}</div><h2>Message to ${esc(PR().contact)}</h2></div><button class="btn ghost sm" data-act="modalClose" aria-label="Close">${ic('x')}</button></header>
 <div class="row between" style="margin-bottom:10px"><span class="small muted">${m.issues} differences · ${usd(m.claim)}</span><div class="seg-c" role="group" aria-label="Language"><button data-act="claimLang" data-l="en" aria-pressed="${lang==='en'}">English</button><button data-act="claimLang" data-l="zh" aria-pressed="${lang==='zh'}">中文</button></div></div>
 <textarea id="claimTxt" rows="14" readonly aria-label="Claim message">${esc(claimText(s,lang))}</textarea>
 <div class="mfoot"><button class="btn" data-act="claimTask">${ic('cal')}Remind me to follow up</button><button class="btn pri" data-act="copyTA" data-t="claimTxt">${ic('copy')}Copy for WeChat</button></div>`}

/* ---------- Stock ---------- */
function vStock(){const tab=S.ui.stockTab;
 return vh('What you have and what it cost','Stock & costs','Landed cost includes freight, URA taxes and clearing, so your margins are real. Pick items and send the next order back to China.',`<div class="seg-c" role="group" aria-label="Stock view"><button data-act="stockTab" data-t="list" aria-pressed="${tab==='list'}">Stock list</button><button data-act="stockTab" data-t="calc" aria-pressed="${tab==='calc'}">Landed cost</button></div>`)+(tab==='list'?stockList():calcHTML())}
function stockList(){const sel=S.ui.sel,val=S.products.reduce((a,p)=>a+p.stock*landed(p),0),sales=S.products.reduce((a,p)=>a+p.stock*p.sell,0),low=S.products.filter(p=>p.stock<p.reorder);
 return `<section class="kpis"><div class="kpi"><small>Stock at landed cost</small><b>${ugxC(val)}</b><small>at UGX ${fmtN(S.rate)} per USD</small></div><div class="kpi"><small>If sold at shelf price</small><b>${ugxC(sales)}</b><small>${Math.round((1-val/sales)*100)}% average margin</small></div><div class="kpi"><small>Below reorder level</small><b>${low.length} items</b><small>${low.filter(p=>!onOrder(p.id)).length} not on order yet</small></div></section>
 <div class="row between" style="margin:16px 0 10px"><div class="row"><button class="btn sm" data-act="selLow">Select items to reorder</button><span class="small muted">${sel.size} selected</span></div><button class="btn pri" data-act="reorder" ${sel.size?'':'disabled'}>${ic('loop')}Draft China order (${sel.size})</button></div>
 <div class="tbl-wrap"><table><thead><tr><th><span class="sr">Select</span></th><th>Item</th><th class="num">In stock</th><th>Status</th><th class="num">Landed per unit</th><th class="num">Shelf price</th><th class="num">Margin</th><th class="num">Sold 30 days</th><th class="num">Days left</th></tr></thead><tbody>
 ${S.products.map(p=>{const oo=onOrder(p.id),st=p.stock===0?['bad','Out of stock','out']:p.stock<p.reorder?['warn','Low','low']:['ok','Healthy',''],lc=landed(p),mg=Math.round((p.sell-lc)/p.sell*100),cov=p.sold?Math.round(p.stock/(p.sold/30)):0,on=sel.has(p.id);
 return `<tr class="${on?'sel':''}"><td><input type="checkbox" aria-label="Select ${esc(p.name)}" data-ch="selP" data-id="${p.id}" ${on?'checked':''}></td><td><b>${esc(p.name)}</b><div class="mono muted">${p.sku} · ${p.per}/${p.pack}</div></td><td class="num"><b>${fmtN(p.stock)}</b> <span class="small muted">${p.unit}</span><div class="lvl ${st[2]}" title="Line marks the reorder level of ${fmtN(p.reorder)}"><i style="width:${Math.min(100,p.stock/(p.reorder*2)*100)}%"></i><em></em></div></td><td><span class="pill ${st[0]}">${st[1]}</span>${oo?`<div class="small muted">${fmtN(oo)} on the way</div>`:''}</td><td class="num">${ugx(lc)}</td><td class="num">${ugx(p.sell)}</td><td class="num ${mg<25?'warn-t':''}">${mg}%</td><td class="num">${fmtN(p.sold)}</td><td class="num ${cov<14?'bad-t':''}">${cov}</td></tr>`}).join('')}</tbody></table></div>`}
function calcFromProduct(pid){const p=prod(pid),units=p.per*Math.max(2,Math.round(p.sold*1.5/p.per));S.ui.calc={pid,units,fob:p.fob,freight:Math.round(units*p.fob*.12),ins:1,duty:25,vat:18,wht:6,idf:1,levy:1.5,local:1800000,markup:35}}
function calcHTML(){const c=S.ui.calc,f=(k,l,step='any')=>`<div class="field"><label for="c-${k}">${l}</label><input id="c-${k}" type="number" step="${step}" min="0" value="${k==='rate'?S.rate:c[k]}" data-bind="calc" data-k="${k}"></div>`;
 return `<div class="grid gside" style="margin-top:0"><section class="card"><div class="ch"><h2>Landed cost calculator</h2></div><p class="small muted" style="margin:0 0 14px">Example rates. Edit them to match the URA assessment from your clearing agent.</p>
 <div class="fgrid"><div class="field" style="grid-column:1/-1"><label for="c-pid">Item</label><select id="c-pid" data-ch="calcP">${S.products.map(p=>`<option value="${p.id}" ${p.id===c.pid?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div>
 ${f('units','Units')}${f('fob','Price per unit (USD, FOB)')}${f('freight','Freight total (USD)')}${f('ins','Insurance %')}
 <div class="field"><label for="c-duty">Import duty</label><select id="c-duty" data-bind="calc" data-k="duty">${[0,10,25,35].map(d=>`<option value="${d}" ${+c.duty===d?'selected':''}>${d}%</option>`).join('')}</select></div>
 ${f('vat','VAT %')}${f('wht','Withholding tax %')}${f('idf','Import declaration fee %')}${f('levy','Infrastructure levy %')}${f('local','Clearing and transport (UGX)')}${f('rate','UGX per USD')}${f('markup','Your markup %')}</div></section>
 <section class="card" id="calcOut">${calcOut()}</section></div>`}
function calcOut(){const c=S.ui.calc,n=v=>+v||0,units=Math.max(1,n(c.units)),goods=units*n(c.fob),cif=goods+n(c.freight)+goods*n(c.ins)/100,duty=cif*n(c.duty)/100,vat=(cif+duty)*n(c.vat)/100,wht=cif*n(c.wht)/100,idf=cif*n(c.idf)/100,levy=cif*n(c.levy)/100,tax=duty+vat+wht+idf+levy,r=S.rate,total=(cif+tax)*r+n(c.local),per=total/units,sug=per*(1+n(c.markup)/100),p=prod(c.pid);
 const row=(l,u,b)=>`<tr${b?' class="strong"':''}><td>${l}</td><td class="num">${u==null?'':usd(u)}</td><td class="num">${ugx(u==null?n(c.local):u*r)}</td></tr>`;
 return `<div class="ch"><h2>Cost per ${one(p.unit)}</h2><span class="pill info">${Math.round(tax*r/total*100)}% is tax</span></div>
 <div class="row" style="gap:28px;margin-bottom:14px"><div><div class="small muted">Landed</div><div style="font-size:26px;font-weight:700" class="tnum">${ugx(per)}</div></div><div><div class="small muted">Suggested price</div><div style="font-size:26px;font-weight:700" class="tnum accent-t">${ugx(Math.ceil(sug/500)*500)}</div><div class="small muted">Your shelf price now: ${ugx(p.sell)}</div></div></div>
 <div class="tbl-wrap"><table><thead><tr><th>Cost</th><th class="num">USD</th><th class="num">UGX</th></tr></thead><tbody>${row('Goods (FOB)',goods)}${row('Freight + insurance',cif-goods)}${row('CIF value',cif,1)}${row('Import duty',duty)}${row('VAT',vat)}${row('Withholding tax',wht)}${row('Import declaration fee',idf)}${row('Infrastructure levy',levy)}${row('Clearing and transport',null)}</tbody><tfoot><tr><td>Total landed · ${fmtN(units)} ${p.unit}</td><td class="num"></td><td class="num">${ugx(total)}</td></tr></tfoot></table></div>`}

/* ---------- Reorder ---------- */
function openReorder(pids){
 if(!pids){pids=S.ui.sel.size?[...S.ui.sel]:S.products.filter(p=>p.stock<p.reorder&&!onOrder(p.id)).map(p=>p.id);if(!pids.length)pids=S.products.filter(p=>p.stock<p.reorder).map(p=>p.id)}
 if(!pids.length)pids=[0];
 S.ui.reo={lines:pids.map(id=>{const p=prod(id);return {pid:id,oc:Math.max(1,Math.ceil((p.reorder*2-p.stock)/p.per))}}),lang:'en',route:'sea'};modal(reoHTML())}
function reoTotal(){return S.ui.reo.lines.reduce((a,l)=>{const p=prod(l.pid);return a+l.oc*p.per*p.fob},0)}
function reoText(){const R=S.ui.reo,P=PR(),B=S.brand,tot=reoTotal(),n=R.lines.reduce((a,l)=>a+l.oc,0);
 const L=R.lines.map(l=>{const p=prod(l.pid);return R.lang==='zh'?`- ${p.name}（${p.sku}）：${l.oc} 箱 × ${p.per} 件`:`- ${p.name} (${p.sku}): ${l.oc} ${p.pack} x ${p.per} ${p.unit}`}).join('\n');
 const via=R.route==='air'?(R.lang==='zh'?'空运至恩德培':'air cargo to Entebbe'):(R.lang==='zh'?'海运至蒙巴萨，再陆运至坎帕拉':'sea freight to Mombasa, then truck to Kampala');
 if(R.lang==='zh')return `${P.zh}您好，\n\n请按以下订单发形式发票（PI）：\n${L}\n\n按上次价格预计总额 ${usd(tot)}。我们先付 30% 定金，装柜前付清 70% 余款。\n运输方式：${via}。\n唛头：${B.name} / KLA / C/No. 1-${n}\n\n谢谢！\n${B.owner}，${B.name}`;
 return `Hello ${P.contact},\n\nPlease send a proforma invoice (PI) for this order:\n${L}\n\nEstimated total ${usd(tot)} at last prices. We pay 30% deposit now and 70% balance before loading.\nShipping: ${via}.\nShipping mark: ${B.name} / KLA / C/No. 1-${n}\n\nThank you,\n${B.owner}, ${B.name}`}
function reoHTML(){const R=S.ui.reo,P=PR(),tot=reoTotal();
 return `<header class="mh"><div><div class="eyebrow">Back to ${esc(P.city)}</div><h2>New order for ${esc(P.supplier)}</h2></div><button class="btn ghost sm" data-act="modalClose" aria-label="Close">${ic('x')}</button></header>
 <div class="tbl-wrap"><table><thead><tr><th>Item</th><th class="num">In stock</th><th class="num">Packages</th><th class="num">Units</th><th class="num">USD</th><th><span class="sr">Remove</span></th></tr></thead><tbody>
 ${R.lines.map((l,i)=>{const p=prod(l.pid);return `<tr><td><b>${esc(p.name)}</b><div class="mono muted">${p.sku}</div></td><td class="num">${fmtN(p.stock)}</td><td class="num"><input class="td-in" type="number" min="1" id="reo-${i}" value="${l.oc}" data-ch="reoQty" data-i="${i}" aria-label="Packages of ${esc(p.name)}"></td><td class="num">${fmtN(l.oc*p.per)}</td><td class="num">${usd0(l.oc*p.per*p.fob)}</td><td><button class="btn ghost sm" data-act="reoDel" data-i="${i}" aria-label="Remove ${esc(p.name)}">${ic('x')}</button></td></tr>`}).join('')}</tbody>
 <tfoot><tr><td>Total</td><td></td><td class="num">${R.lines.reduce((a,l)=>a+l.oc,0)}</td><td></td><td class="num">${usd0(tot)}</td><td></td></tr></tfoot></table></div>
 <div class="row between" style="margin:14px 0"><div class="seg-c" role="group" aria-label="Route"><button data-act="reoRoute" data-r="sea" aria-pressed="${R.route==='sea'}">Sea, about 45 days</button><button data-act="reoRoute" data-r="air" aria-pressed="${R.route==='air'}">Air, about 10 days</button></div><span class="small muted">Deposit 30%: <b>${usd0(tot*.3)}</b> · Balance before loading: <b>${usd0(tot*.7)}</b></span></div>
 <div class="field"><div class="row between"><label for="reoMsg">Proforma invoice request</label><div class="seg-c" role="group" aria-label="Language"><button data-act="reoLang" data-l="en" aria-pressed="${R.lang==='en'}">English</button><button data-act="reoLang" data-l="zh" aria-pressed="${R.lang==='zh'}">中文</button></div></div><textarea id="reoMsg" rows="10" readonly>${esc(reoText())}</textarea></div>
 <div class="mfoot"><button class="btn" data-act="copyTA" data-t="reoMsg">${ic('copy')}Copy message</button><button class="btn pri" data-act="createOrder" ${R.lines.length?'':'disabled'}>${ic('plus')}Create order and track it</button></div>`}

/* ---------- Social ---------- */
function caption(){const so=S.ui.soc,p=prod(so.pid),B=S.brand,P=PR(),inc=incomingFor(p.id);
 const price=so.price?`${ugx(p.sell)} per ${one(p.unit)}`:'Ask for our price';
 const pre=so.preorder&&inc?` Arriving ${fD(inc.eta)}. Book now with 30% deposit and pick up first.`:'';
 const tags=`#Kampala #UgandaWholesale #${P.market.replace(/\s+/g,'')} #ShopUganda`;
 const T=[`NEW IN at ${B.name}. ${p.name}, ${price}. Wholesale from 1 ${p.pack} (${p.per} ${p.unit}).${pre}\nDM us or WhatsApp ${B.wa} to order.\n${tags}`,
  `Boss deal this week: ${p.name}. ${price}. Limited stock, first come first served.${pre}\nTap Inquire or WhatsApp ${B.wa}.\n${tags}`,
  `Restocked and ready: ${p.name}, straight from ${P.city}. ${price}. Delivery in Kampala, upcountry by bus.${pre}\nBook on WhatsApp ${B.wa}.\n${tags}`];
 return T[so.v%3]}
function vSocial(){const tab=S.ui.socialTab,n=S.inquiries.filter(q=>q.status==='new').length;
 return vh('Post, get inquiries, take bookings','Social & bookings','Upload a product photo once, preview it for each platform with your logo, and handle every inquiry and booking in one inbox.',`<div class="seg-c" role="group" aria-label="Social view"><button data-act="socialTab" data-t="create" aria-pressed="${tab==='create'}">Create post</button><button data-act="socialTab" data-t="inbox" aria-pressed="${tab==='inbox'}">Inquiries${n?` · ${n}`:''}</button><button data-act="socialTab" data-t="bookings" aria-pressed="${tab==='bookings'}">Bookings · ${S.bookings.filter(b=>!b.done).length}</button></div>`)+(tab==='create'?createHTML():tab==='inbox'?inboxHTML():bookingsHTML())}
function createHTML(){const so=S.ui.soc,p=prod(so.pid),inc=incomingFor(p.id);
 return `<div class="soc"><section class="card stack"><div class="ch" style="margin:0"><h2>New post</h2></div>
 <label class="drop" for="socImg" id="drop"><span class="thumb">${so.img?`<img src="${so.img}" alt="">`:ic('image')}</span><span><b>${so.img?'Photo added':'Upload a product photo'}</b><span class="small muted" style="display:block">${so.img?'Tap to change it.':'JPG or PNG from your phone. Until then a sample visual is used.'}</span></span></label>
 <input type="file" id="socImg" accept="image/*" data-ch="socImg" class="sr">
 ${so.img?`<button class="btn sm" data-act="socNoImg" style="align-self:flex-start">${ic('trash')}Remove photo</button>`:''}
 <div class="field"><label for="socP">Product</label><select id="socP" data-ch="socP">${S.products.map(x=>`<option value="${x.id}" ${x.id===so.pid?'selected':''}>${esc(x.name)} · ${ugx(x.sell)}</option>`).join('')}</select></div>
 <div class="stack" style="gap:10px"><label class="switch"><input type="checkbox" data-ch="socOpt" data-k="price" ${so.price?'checked':''}>Show price</label><label class="switch"><input type="checkbox" data-ch="socOpt" data-k="wm" ${so.wm?'checked':''}>Add my logo to the photo</label><label class="switch"><input type="checkbox" data-ch="socOpt" data-k="preorder" ${so.preorder?'checked':''} ${inc?'':'disabled'}>Take bookings from incoming shipment ${inc?`<span class="small muted">(${inc.ref}, ${fD(inc.eta)})</span>`:'<span class="small muted">(not on order)</span>'}</label></div>
 <div class="field"><span class="flabel">Post to</span><div class="cchips">${CHANNELS.map(c=>`<label class="cchip"><input type="checkbox" data-ch="socCh" data-c="${c}" ${so.ch[c]?'checked':''}>${c}</label>`).join('')}</div></div>
 <div class="field"><div class="row between"><label for="socCap">Caption</label><button class="btn sm ghost" data-act="socRewrite">${ic('spark')}Write another</button></div><textarea id="socCap" rows="6" data-bind="soccap">${esc(so.caption)}</textarea></div>
 <div class="row"><button class="btn pri" data-act="publish">${ic('send')}Publish now</button><span class="small muted">Inquiries from every post land in your Inquiries inbox.</span></div></section>
 <section class="card"><div class="ch"><h2>Preview</h2><div class="seg-c" role="group" aria-label="Preview format"><button data-act="socPrev" data-p="feed" aria-pressed="${so.prev==='feed'}">Feed post</button><button data-act="socPrev" data-p="story" aria-pressed="${so.prev==='story'}">Story or status</button></div></div><div id="socPreview">${socPreview()}</div></section></div>
 <section class="card" style="margin-top:16px"><div class="ch"><h2>Recent posts</h2><span class="small muted">Views and inquiries per post</span></div><div class="posts">${S.posts.map(x=>{const q=prod(x.pid);return `<div class="post"><span class="pt">${x.img?`<img src="${x.img}" alt="">`:esc(initials())}</span><div style="min-width:0"><b>${esc(q.name)}</b><div class="small muted">${x.when} · ${esc(x.ch.join(', '))}</div></div><div class="stats"><span><b>${fmtN(x.views)}</b> views</span><span><b>${x.inq}</b> inquiries</span></div></div>`}).join('')}</div></section>`}
function socPreview(){const so=S.ui.soc,p=prod(so.pid),B=S.brand,inc=incomingFor(p.id),pre=so.preorder&&inc,handle='@'+(B.name.toLowerCase().replace(/[^a-z0-9]+/g,'')||'yourshop')+'.ug';
 const art=so.img?`<img src="${so.img}" alt="Product photo">`:`<div class="ph-art"><span class="mono">${esc(p.sku)} · sample visual</span><span class="pn">${esc(p.name)}</span></div>`;
 const wm=so.wm?`<span class="wm">${logoHTML('sm')}<span>${esc(B.name)}</span></span>`:'';
 if(so.prev==='feed')return `<div class="phone"><div class="screen"><div class="fp-h">${logoHTML('sm')}<div><b>${esc(handle)}</b><small>Kampala, Uganda</small></div></div><div class="fp-img">${art}${wm}${so.price?`<span class="ptag">${ugx(p.sell)}</span>`:''}${pre?`<span class="pre">Book now</span>`:''}</div><div class="fp-cta"><span>${pre?'Book on WhatsApp':'Inquire on WhatsApp'}</span>${ic('arrow')}</div><div class="fp-cap">${esc(so.caption).replace(/\n/g,'<br>')}</div></div></div>`;
 return `<div class="phone" style="width:min(270px,100%)"><div class="screen story"><div class="st-img">${art}</div><div class="st-ov"></div><div class="st-bars"><i></i><i></i><i></i></div><div class="st-h">${logoHTML('sm')}<b>${esc(B.name)}</b><small>2m</small></div><div class="st-txt"><b>${esc(p.name)}</b>${so.price?`<span>${ugx(p.sell)}</span>`:''}${pre?`<span class="small">Arriving ${fD(inc.eta)} · book with deposit</span>`:''}</div><span class="st-cta">${pre?'Tap to book':'Tap to inquire'}</span></div></div>`}
function inboxHTML(){const q=S.inquiries.find(x=>x.id===S.ui.inq)||S.inquiries[0];if(!q)return '<div class="card empty"><h2>No inquiries yet</h2></div>';S.ui.inq=q.id;const p=prod(q.pid),P=PR(),inc=incomingFor(p.id);
 const qr=[`Yes, it is available. ${p.name} is ${ugx(p.sell)}. How many do you need?`,`Wholesale for 1 ${p.pack} (${p.per} ${p.unit}) is ${ugx(Math.round(p.sell*p.per*.85/1000)*1000)}.`,`You can book now with 30% deposit on mobile money. We keep it for you until pickup.`,`We are in ${P.market}, Kampala. We also deliver upcountry by bus.`];
 const st={new:['info','New'],replied:['mute','Replied'],booked:['ok','Booked']};
 const incs=S.shipments.filter(s=>s.stage<recv(s));
 return `<div class="inbox"><section class="card" style="padding:6px"><div class="inq-list">${S.inquiries.map(x=>`<button class="inq ${x.id===q.id?'on':''}" data-act="inqSel" data-id="${x.id}"><span class="inq-top"><b>${esc(x.name)}</b><small>${x.t}</small></span><span class="inq-ch">${x.status==='new'?'<i class="unread"></i>':''}${x.ch} · ${esc(prod(x.pid).name)}</span><span class="inq-x">${esc(x.msgs[x.msgs.length-1].x)}</span></button>`).join('')}</div></section>
 <section class="card"><div class="ch" style="margin-bottom:0"><div><h2>${esc(q.name)}</h2><div class="small muted">${q.ch} · asking about ${esc(p.name)}${inc?` · arriving ${fD(inc.eta)}`:''}</div></div><span class="pill ${st[q.status][0]}">${st[q.status][1]}</span></div>
 <div class="thread">${q.msgs.map(m=>`<div class="bub ${m.f}">${esc(m.x)}</div>`).join('')}</div>
 <div class="qr" aria-label="Quick replies">${qr.map((r,i)=>`<button data-act="quick" data-i="${i}">${esc(r)}</button>`).join('')}</div>
 <div class="field"><label for="inqReply">Reply on ${q.ch}</label><textarea id="inqReply" rows="3" placeholder="Type a reply"></textarea></div>
 <div class="row" style="margin-top:10px"><button class="btn pri" data-act="sendReply">${ic('send')}Send reply</button><button class="btn" data-act="bookOpen">${ic('cal')}${S.ui.bkOpen?'Close booking':'Create booking'}</button></div>
 ${S.ui.bkOpen?`<div class="bkform"><div class="fgrid"><div class="field"><label for="bkQty">Quantity (${p.unit})</label><input id="bkQty" type="number" min="1" value="${p.per}" data-ch="bkQty"></div><div class="field"><label for="bkDep">Deposit (UGX)</label><input id="bkDep" type="number" min="0" step="1000" value="${Math.round(p.per*p.sell*.3/1000)*1000}"></div><div class="field"><label for="bkFrom">Pick up from</label><select id="bkFrom">${p.stock>0?'<option value="stock">Stock in the shop now</option>':''}${incs.map(s=>`<option value="${s.id}" ${inc&&inc.id===s.id?'selected':''}>${s.ref} · arriving ${fD(s.eta)}</option>`).join('')}</select></div></div><div class="row" style="margin-top:12px"><button class="btn pri" data-act="bookSave">Save booking</button><span class="small muted">Total ${ugx(p.per*p.sell)} at shelf price</span></div></div>`:''}</section></div>`}
function bookingsHTML(){const rows=S.bookings.map(b=>{const p=prod(b.pid),s=b.sid?ship(b.sid):null,total=b.qty*p.sell,stt=b.done?['mute','Picked up']:(!s||s.confirmed)?['ok','Ready for pickup']:['info',`Waiting · ${stages(s)[s.stage]}`];
 return `<tr><td><b>${esc(b.name)}</b><div class="small muted">${b.ch}</div></td><td>${esc(p.name)}</td><td class="num">${fmtN(b.qty)}</td><td class="num">${ugx(total)}</td><td class="num">${ugx(b.deposit)}</td><td class="num">${ugx(total-b.deposit)}</td><td>${s?`<span class="mono">${s.ref}</span>`:'Shop stock'}</td><td><span class="pill ${stt[0]}">${stt[1]}</span></td><td>${b.done?'':`<div class="row" style="flex-wrap:nowrap"><button class="btn sm" data-act="bkNotify" data-id="${b.id}">Notify</button><button class="btn sm ghost" data-act="bkDone" data-id="${b.id}">Picked up</button></div>`}</td></tr>`}).join('');
 const dep=S.bookings.filter(b=>!b.done).reduce((a,b)=>a+b.deposit,0);
 return `<section class="kpis" style="margin-top:16px"><div class="kpi"><small>Open bookings</small><b>${S.bookings.filter(b=>!b.done).length}</b><small>from social inquiries</small></div><div class="kpi"><small>Deposits held</small><b>${ugxC(dep)}</b><small>money already in hand</small></div><div class="kpi"><small>Waiting for shipments</small><b>${S.bookings.filter(b=>!b.done&&b.sid&&!ship(b.sid).confirmed).length}</b><small>customers get updates automatically</small></div></section>
 <div class="tbl-wrap" style="margin-top:16px"><table><thead><tr><th>Customer</th><th>Item</th><th class="num">Qty</th><th class="num">Total</th><th class="num">Deposit</th><th class="num">Balance</th><th>From</th><th>Status</th><th><span class="sr">Actions</span></th></tr></thead><tbody>${rows||'<tr><td colspan="9" class="muted">No bookings yet. Create one from an inquiry.</td></tr>'}</tbody></table></div>`}

/* ---------- Push ---------- */
function setPushType(t){const P=PR(),B=S.brand,pu=S.ui.push,s2=S.shipments[1],low=S.products.find(p=>p.stock<p.reorder)||prod(0),p0=prod(0),p1=prod(1);pu.type=t;
 const T={arrivals:['New stock just landed',`Fresh ${p0.name} and ${p1.name} now at ${B.name}, ${P.market}. Wholesale from 1 ${p0.pack}. Reply to book yours.`],
  promo:[`Weekend deal: 10% off ${p1.name}`,`This Saturday only at ${B.name}. Show this message at the counter or order on WhatsApp ${B.wa}.`],
  update:['Your booked goods are on the way',`Good news. Shipment ${s2.ref} is at ${stages(s2)[s2.stage]}, expected in Kampala ${fD(s2.eta)}. We will call you when it is ready.`],
  restock:[`Back soon: ${low.name}`,`${low.name} is on order from ${P.city}. Reply BOOK to reserve yours at ${ugx(low.sell)}.`]};
 pu.title=T[t][0];pu.body=T[t][1];if(t==='update')pu.aud='booked';else if(pu.aud==='booked')pu.aud='all'}
function audiences(){const ib=S.inquiries.filter(q=>q.status!=='replied').length;return [['all','All customers',1240],['wholesale','Wholesale buyers',186],['retail','Retail customers',1054],['booked','Customers who booked',S.bookings.filter(b=>!b.done).length],['inquired','People who inquired this week',ib+31]]}
function vPush(){const pu=S.ui.push,aud=audiences();
 return vh('Reach customers on their phones','Push & promos','Send new stock, promos and shipment updates as app notifications, WhatsApp broadcasts and SMS. Automations do the routine ones for you.')+`
 <div class="grid gside" style="margin-top:0"><section class="card stack"><div class="ch" style="margin:0"><h2>New message</h2></div>
 <div class="seg-c" role="group" aria-label="Message type">${[['arrivals','New stock'],['promo','Promo'],['update','Shipment update'],['restock','Restock alert']].map(([k,l])=>`<button data-act="pType" data-t="${k}" aria-pressed="${pu.type===k}">${l}</button>`).join('')}</div>
 <div class="field"><label for="pTitle">Title</label><input type="text" id="pTitle" value="${esc(pu.title)}" data-bind="push" data-k="title" maxlength="60"></div>
 <div class="field"><label for="pBody">Message</label><textarea id="pBody" rows="4" data-bind="push" data-k="body">${esc(pu.body)}</textarea><span class="small muted" id="smsCount">${smsInfo()}</span></div>
 <div class="field"><label for="pAud">Send to</label><select id="pAud" data-ch="pAud">${aud.map(a=>`<option value="${a[0]}" ${pu.aud===a[0]?'selected':''}>${a[1]} · ${fmtN(a[2])}</option>`).join('')}</select></div>
 <div class="field"><span class="flabel">Channels</span><div class="cchips">${Object.keys(pu.ch).map(c=>`<label class="cchip"><input type="checkbox" data-ch="pCh" data-c="${c}" ${pu.ch[c]?'checked':''}>${c}</label>`).join('')}</div></div>
 <div class="field"><span class="flabel">When</span><div class="seg-c" role="group" aria-label="When">${[['now','Now'],['tomorrow','Tomorrow 9:00'],['friday','Friday 9:00']].map(([k,l])=>`<button data-act="pWhen" data-w="${k}" aria-pressed="${pu.when===k}">${l}</button>`).join('')}</div></div>
 <div class="row"><button class="btn pri" data-act="pSend">${ic('send')}${pu.when==='now'?'Send now':'Schedule'}</button></div></section>
 <section class="card"><div class="ch"><h2>On a customer's phone</h2></div><div class="phone" style="width:min(290px,100%)"><div class="lock" id="pushPrev">${lockHTML()}</div></div></section></div>
 <div class="grid g2"><section class="card"><div class="ch"><h2>Automations</h2><span class="small muted">Run without you</span></div><div class="autos">${S.autos.map(a=>`<label class="auto switch"><span>${esc(a.t)}</span><input type="checkbox" data-ch="auto" data-id="${a.id}" ${a.on?'checked':''}></label>`).join('')}</div></section>
 <section class="card"><div class="ch"><h2>Sent and scheduled</h2></div><div class="sent">${S.sent.map(x=>`<div><span><b>${esc(x.title)}</b><span class="small muted" style="display:block">${esc(x.aud)} · ${esc(x.ch.join(', '))}</span></span><span class="small"><span class="pill ${x.status==='Sent'?'ok':'info'}">${x.status}</span> <span class="muted">${x.when} · ${fmtN(x.reach)} people</span></span></div>`).join('')}</div></section></div>`}
function smsInfo(){const n=S.ui.push.body.length;return `${n} characters · ${Math.max(1,Math.ceil(n/160))} SMS per person`}
function lockHTML(){const pu=S.ui.push,B=S.brand,d=new Date();return `<div class="lt">${pad(d.getHours())}:${pad(d.getMinutes())}</div><div class="ld">${d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</div>
 <div class="ncard">${logoHTML('sm')}<div style="min-width:0"><div class="nt"><span>${esc(B.name)}</span><span>now</span></div><strong>${esc(pu.title)}</strong><span>${esc(pu.body)}</span></div></div>
 <div class="ncard dim">${logoHTML('sm')}<div><div class="nt"><span>${esc(B.name)}</span><span>Sat</span></div><strong>Weekend wholesale prices</strong><span>Price list for wholesale buyers inside.</span></div></div>`}

/* ---------- Assistant ---------- */
function sugList(){const P=PR(),out=[],done=S.ui.sugDone;
 S.shipments.forEach(s=>{const m=matchSum(s);if(m.issues&&!s.confirmed&&s.stage===recv(s))out.push(['claim'+s.id,`Send the ${usd(m.claim)} claim for ${s.ref} to ${P.contact}`,'Supplier','Me'])});
 const lowN=S.products.filter(p=>p.stock<p.reorder&&!onOrder(p.id));if(lowN.length)out.push(['low',`Order ${listJoin(lowN.map(p=>p.name))} from ${P.city}`,'Supplier','Me']);
 const op=S.inquiries.filter(q=>q.status==='new').length;if(op)out.push(['inq',`Reply to ${op} social inquiries`,'Customers','Shop manager']);
 const w=S.bookings.filter(b=>!b.done&&b.sid&&!ship(b.sid).confirmed).length;if(w)out.push(['bk',`Call ${w} customers about their bookings`,'Customers','Shop manager']);
 out.push(['review','Review this week\'s sales and cash at the bank','Business','Me']);
 return out.filter(x=>!done.has(x[0]))}
function vAssistant(){const B=S.brand,P=PR(),f=S.ui.paF;
 const fil=t=>f==='all'||(f==='personal'?t.c==='Personal':t.c!=='Personal'),byT=(a,b)=>a.t.localeCompare(b.t);
 const today=S.tasks.filter(t=>t.day==='Today'&&fil(t)).sort(byT),tom=S.tasks.filter(t=>t.day==='Tomorrow'&&fil(t)).sort(byT),now=nowHM();
 const s2=S.shipments[1],s3=S.shipments.find(s=>!s.balancePaid),atR=S.shipments.find(s=>s.stage===recv(s)&&!s.confirmed),op=S.inquiries.filter(q=>q.status==='new').length,doneN=S.tasks.filter(t=>t.day==='Today'&&t.done).length,totN=S.tasks.filter(t=>t.day==='Today').length;
 const brief=[`${s2.ref} is at ${stages(s2)[s2.stage].toLowerCase()}${s2.stage<recv(s2)?`, due in Kampala ${fD(s2.eta)}`:''}.`];
 if(atR)brief.push(`${atR.cno} is at your store waiting to be counted.`);
 if(s3)brief.push(`Supplier balance of ${usd0(shipUSD(s3)*.7)} for ${s3.ref} is due in ${daysTo(s3.balanceDue)} days.`);
 brief.push(`${op} new inquiries and ${S.bookings.filter(b=>!b.done).length} open bookings.`);
 let nowPut=false;const tl=today.map(t=>{let pre='';if(!nowPut&&t.t>now){nowPut=true;pre=`<div class="nowline">Now · ${now}</div>`}return pre+tlRow(t,now)}).join('')+(!nowPut&&today.length?`<div class="nowline">Now · ${now}</div>`:'');
 const pays=[...S.shipments.filter(s=>!s.balancePaid).map(s=>({id:'s'+s.id,x:`Supplier balance 70% · ${s.ref}`,amt:usd0(shipUSD(s)*.7),due:s.balanceDue,paid:false,sid:s.id})),...S.pays].sort((a,b)=>a.due-b.due);
 const contacts=[[P.contact,`Supplier, ${P.city}`,`WeChat ${P.wechat}`],['Mr. Kato','Cargo agent, Guangzhou to Kampala','+256 700 000 118'],['Mukasa Clearing & Forwarding','Clearing agent, URA','+256 700 000 230'],['Ssemwogerere','Truck driver, Malaba route','+256 700 000 447'],['Nakato Prossy','Shop manager','+256 700 000 965']];
 return vh(`${fD(new Date())} · ${doneN} of ${totN} done`,'My assistant','Your day, money and people in one place. Type a task the way you would say it and the assistant sorts it.')+`
 <section class="card brief"><div class="eyebrow">Daily brief</div><h2>Here is your day, ${esc(B.owner)}</h2><ul>${brief.map(b=>`<li>${esc(b)}</li>`).join('')}</ul>
 <div class="qadd"><label class="sr" for="paAdd">Add a task</label><input type="text" id="paAdd" placeholder="e.g. Call ${esc(P.contact)} about samples at 3pm"><button class="btn pri" data-act="addTask">${ic('plus')}Add</button></div></section>
 <div class="grid gside"><section class="card"><div class="ch"><h2>Today</h2><div class="seg-c" role="group" aria-label="Filter tasks">${[['all','All'],['business','Business'],['personal','Personal']].map(([k,l])=>`<button data-act="paF" data-f="${k}" aria-pressed="${f===k}">${l}</button>`).join('')}</div></div><div class="tl">${tl||'<p class="muted">No tasks in this filter.</p>'}</div>
 ${tom.length?`<h3 style="margin-top:18px">Tomorrow</h3><div class="tl">${tom.map(t=>tlRow(t,'99:99')).join('')}</div>`:''}</section>
 <div class="stack" style="gap:16px"><section class="card"><div class="ch"><h2>Suggested for you</h2></div>${sugList().map(x=>`<div class="sug"><p>${esc(x[1])}</p><button class="btn sm" data-act="suggest" data-k="${x[0]}">${ic('plus')}Add to my day</button></div>`).join('')||'<p class="muted small">Nothing new to suggest.</p>'}</section>
 <section class="card"><div class="ch"><h2>Money due</h2></div>${pays.map(p=>`<div class="sug"><p><b>${esc(p.x)}</b><span class="small muted" style="display:block">${p.amt} · ${p.paid?'paid':`due ${fD(p.due)}`}</span></p>${p.paid?'<span class="pill ok">Paid</span>':`<button class="btn sm" data-act="payDone" data-id="${p.id}">Mark paid</button>`}</div>`).join('')}</section>
 <section class="card"><div class="ch"><h2>Key contacts</h2></div>${contacts.map(c=>`<div class="contact"><div style="min-width:0"><b>${esc(c[0])}</b><small>${esc(c[1])}</small><span class="mono">${esc(c[2])}</span></div><button class="btn sm ghost" data-act="copy" data-v="${esc(c[2].replace(/^WeChat /,''))}" aria-label="Copy ${esc(c[2])}">${ic('copy')}</button></div>`).join('')}</section></div></div>`}
function tlRow(t,now){const missed=!t.done&&t.day==='Today'&&t.t<now;return `<div class="tl-i ${t.done?'done':''}"><input type="checkbox" data-ch="toggleTask" data-id="${t.id}" ${t.done?'checked':''} aria-label="Done: ${esc(t.x)}"><span class="mono">${t.t}</span><div class="tl-x" style="min-width:0"><div class="tx">${esc(t.x)}</div><div class="meta"><span class="pill mute">${t.c}</span>${missed?'<span class="pill warn">Missed</span>':''}<label class="sr" for="as-${t.id}">Assign to</label><select id="as-${t.id}" data-ch="assign" data-id="${t.id}">${['Me','Shop manager','Driver','Accountant'].map(w=>`<option ${t.w===w?'selected':''}>${w}</option>`).join('')}</select></div></div><button class="btn ghost sm" data-act="delTask" data-id="${t.id}" aria-label="Delete task">${ic('x')}</button></div>`}
function parseTask(txt){const m=txt.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i)||txt.match(/\b(\d{1,2}):(\d{2})\b/);let time=null;
 if(m){let h=parseInt(m[1],10),mi=m[2]?parseInt(m[2],10):0;const ap=m[3]&&m[3].toLowerCase();if(ap==='pm'&&h<12)h+=12;if(ap==='am'&&h===12)h=0;if(h<24&&mi<60)time=pad(h)+':'+pad(mi)}
 const low=txt.toLowerCase();let c='Business';
 if(/\b(pay|bank|deposit|momo|mobile money|cash|loan|balance|tt)\b/.test(low))c='Money';else if(/\b(ura|clear|clearing|malaba|mombasa|port|container|agent|customs)\b/.test(low))c='Clearing';else if(/\b(supplier|wechat|china|sample|samples|factory|pi|proforma|alibaba)\b/.test(low))c='Supplier';else if(/\b(customer|customers|reply|deliver|delivery|booking|book)\b/.test(low))c='Customers';else if(/\b(school|kids|children|church|gym|family|wife|husband|doctor|chama|wedding|birthday|home|mum|dad)\b/.test(low))c='Personal';
 let x=txt;if(m)x=x.replace(m[0],'');x=x.replace(/\btomorrow\b/i,'').replace(/\s+(at|by)\s*$/i,'').replace(/\s{2,}/g,' ').trim();
 return {id:nid(),t:time||nextHour(),x:x||txt,c,w:'Me',done:false,day:/\btomorrow\b/i.test(low)?'Tomorrow':'Today'}}

/* ---------- Brand ---------- */
function vBrand(){const B=S.brand,cur=B.color||'';const sw=['#0D6B62','#1D4ED8','#8E1B3A','#B7791F','#15803D','#6D28D9','#1F2937'];
 return vh('Make it yours','Brand & plan','Every screen, post and notification carries the business name, logo and colour. Switch the business type to see the system adapt to another kind of trader.')+`
 <div class="grid gside" style="margin-top:0"><section class="card stack"><div class="ch" style="margin:0"><h2>Business details</h2></div>
 <div class="fgrid"><div class="field"><label for="bName">Business name</label><input type="text" id="bName" value="${esc(B.name)}" data-bind="brand" data-k="name" maxlength="40"></div><div class="field"><label for="bOwner">Owner, as the assistant greets you</label><input type="text" id="bOwner" value="${esc(B.owner)}" data-bind="brand" data-k="owner" maxlength="30"></div>
 <div class="field"><label for="bTag">Tagline</label><input type="text" id="bTag" value="${esc(B.tagline)}" data-bind="brand" data-k="tagline" maxlength="60"></div><div class="field"><label for="bWa">WhatsApp for orders</label><input type="tel" id="bWa" value="${esc(B.wa)}" data-bind="brand" data-k="wa"></div>
 <div class="field"><label for="bType">Business type</label><select id="bType" data-ch="type">${Object.entries(PRESETS).map(([k,p])=>`<option value="${k}" ${k===S.type?'selected':''}>${p.label}</option>`).join('')}</select></div></div>
 <div class="field"><span class="flabel">Logo</span><div class="row"><span data-brand-logo>${logoHTML()}</span><label class="btn" for="bLogo">${ic('upload')}Upload logo</label><input type="file" id="bLogo" accept="image/*" data-ch="logo" class="sr">${B.logo?`<button class="btn ghost" data-act="logoReset">Use initials instead</button>`:''}<span class="small muted">Square PNG works best</span></div></div>
 <div class="field"><span class="flabel">Brand colour</span><div class="swatches">${sw.map(c=>`<button class="sw" style="background:${c}" data-act="color" data-c="${c}" aria-label="Colour ${c}" aria-pressed="${(cur||'#0D6B62').toLowerCase()===c.toLowerCase()}"></button>`).join('')}<label class="sr" for="bColor">Custom colour</label><input type="color" id="bColor" value="${cur||'#0D6B62'}" data-bind="brandColor"></div></div>
 <div class="field"><span class="flabel">Connected channels</span><div class="autos">${Object.keys(B.chan).map(k=>`<label class="auto switch"><span>${k}</span><input type="checkbox" data-ch="chan" data-k="${k}" ${B.chan[k]?'checked':''}></label>`).join('')}</div></div></section>
 <section class="card"><div class="ch"><h2>How it looks</h2></div><div id="brandPrev">${brandPrev()}</div></section></div>
 <section style="margin-top:24px"><div class="ch"><h2 style="font-size:20px;margin:0">Plans for traders</h2><span class="small muted">Example pricing per business, per month</span></div>
 <div class="plans">${PLANS.map(p=>`<div class="card plan ${B.plan===p.id?'on':''}"><h3>${p.n}</h3><div class="small muted">${p.f}</div><div class="pp">UGX ${p.p} <small>/ month</small></div><ul>${p.x.map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn ${B.plan===p.id?'':'pri'}" data-act="plan" data-id="${p.id}" ${B.plan===p.id?'disabled':''}>${B.plan===p.id?'Current plan':'Choose '+p.n}</button></div>`).join('')}</div></section>`}
function brandPrev(){const B=S.brand,P=PR();return `<div class="bprev"><div class="appicon">${logoHTML('lg')}<small>${esc(B.name)}</small><span class="small" style="opacity:.7">App icon on the home screen</span></div>
 <div class="bcard"><span class="eyebrow">${esc(P.label)} · ${esc(P.market)}</span><span class="bn">${esc(B.name)}</span><span class="small">${esc(B.tagline)}</span><span class="small muted" style="margin-top:8px">${esc(B.owner)} · WhatsApp <span class="mono">${esc(B.wa)}</span></span></div>
 <div class="lock" style="aspect-ratio:auto;padding:16px 12px 8px;border-radius:var(--r)"><div class="ncard">${logoHTML('sm')}<div style="min-width:0"><div class="nt"><span>${esc(B.name)}</span><span>now</span></div><strong>New stock just landed</strong><span>Fresh ${esc(prod(0).name)} now in ${esc(P.market)}.</span></div></div></div></div>`}

/* ---------- Overlays ---------- */
let toastT,pushT;
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,3600)}
function modal(h){$('#modalCard').innerHTML=h;$('#modal').hidden=false;const b=$('#modalCard button');b&&b.focus()}
function closeModal(){$('#modal').hidden=true}
function pushBanner(title,body,go,inq){const el=$('#push');el.innerHTML=`${logoHTML()}<div style="min-width:0"><div class="pbt"><span>${esc(S.brand.name)}</span><span>now</span></div><strong>${esc(title)}</strong><span>${esc(body)}</span></div>`;el.dataset.go=go||'';el.dataset.inq=inq||'';el.hidden=false;el.classList.remove('in');void el.offsetWidth;el.classList.add('in');clearTimeout(pushT);pushT=setTimeout(()=>{el.classList.remove('in');setTimeout(()=>el.hidden=true,400)},5600);S.notifs.unshift({title,body,t:'Just now',unread:true});navRender()}
$('#push').addEventListener('click',()=>{const el=$('#push'),g=el.dataset.go;el.classList.remove('in');setTimeout(()=>el.hidden=true,300);if(!g)return;const [v,tab]=g.split(':');if(tab)S.ui.socialTab=tab;if(el.dataset.inq)S.ui.inq=+el.dataset.inq;setView(v)});
function drawer(){const d=$('#drawer');d.innerHTML=`<div class="mh"><div><div class="eyebrow">Alerts</div><h2>Notifications</h2></div><button class="btn ghost sm" data-act="drawerClose" aria-label="Close">${ic('x')}</button></div><button class="btn sm" data-act="readAll" style="margin-bottom:8px">Mark all as read</button>${S.notifs.map(n=>`<div class="nitem ${n.unread?'unread':''}"><b>${esc(n.title)}</b><div>${esc(n.body)}</div><small>${n.t}</small></div>`).join('')}`;d.hidden=false}
function copyText(txt,el){const ok=()=>toast('Copied. Paste it in WeChat, WhatsApp or email.'),fb=()=>{if(el&&el.select){el.focus();el.select()}toast('Text selected. Use your keyboard or long-press to copy.')};try{navigator.clipboard.writeText(txt).then(ok,fb)}catch(e){fb()}}
function addTask(t){S.tasks.push(t);navRender()}

/* ---------- Actions ---------- */
const ACT={
 go:a=>{if(a.dataset.tab)S.ui.socialTab=a.dataset.tab;setView(a.dataset.go)},
 reorder:()=>openReorder(),
 reorderShip:a=>openReorder(ship(+a.dataset.id).items.map(l=>l.pid)),
 openShip:a=>{const id=+a.dataset.id;S.ui.open[id]=true;S.ui.shipFilter='all';S.ui.scrollTo=id;setView('shipments')},
 toggleShip:a=>{const id=+a.dataset.id;S.ui.open[id]=!S.ui.open[id];render()},
 shipFilter:a=>{S.ui.shipFilter=a.dataset.f;render()},
 advance:a=>{const s=ship(+a.dataset.id),st=stages(s),rv=recv(s);
  if(s.stage+1===3&&!s.balancePaid){toast('Pay the 70% balance first. The supplier loads goods after full payment.');return}
  s.stage++;DOCS[s.route].forEach(d=>{if(s.stage>d[1])s.docs[d[0]]=true});
  const bk=S.bookings.filter(b=>b.sid===s.id&&!b.done),auto=S.autos.find(x=>x.id==='a1').on,name=st[s.stage];
  let msg=`${s.ref} moved to ${name}.`;
  if(auto&&bk.length&&/Mombasa|Entebbe|URA|Receiving/.test(name))msg+=` ${bk.length} customers who booked were told on WhatsApp.`;
  if(s.stage===rv){S.ui.matchSid=s.id;addTask({id:nid(),t:nextHour(),x:`Count ${s.cno} against the packing list`,c:'Business',w:'Shop manager',done:false,day:'Today'});pushBanner('Goods at your store',`${s.cno} has arrived. Count the packages now.`,'matching')}
  else S.notifs.unshift({title:'Shipment update',body:msg,t:'Just now',unread:true});
  toast(msg);render()},
 match:a=>{S.ui.matchSid=+a.dataset.id;setView('matching')},
 payBal:a=>{const s=ship(+a.dataset.id);s.balancePaid=true;s.docs['Deposit TT slip']=true;toast(`Balance for ${s.ref} marked paid. The supplier can load now.`);render()},
 stepv:a=>{const s=ship(S.ui.matchSid),l=s.items[+a.dataset.i],k=a.dataset.k,d=+a.dataset.d;if(k==='rc'){l.rc=Math.max(0,(l.rc??0)+d);l.dc=Math.min(l.dc,l.rc)}else{l.dc=Math.max(0,Math.min((l.rc??l.oc),l.dc+d))}render();const el=$(`#${k}-${a.dataset.i}`);el&&el.parentElement.querySelector(`[data-d="${d}"]`).focus()},
 allHere:a=>{const s=ship(S.ui.matchSid),l=s.items[+a.dataset.i];l.rc=l.oc;render()},
 matchRest:()=>{const s=ship(S.ui.matchSid);s.items.forEach(l=>{if(l.rc==null)l.rc=l.oc});render()},
 claim:a=>{S.ui.claimSid=+a.dataset.id;S.ui.claimLang='en';modal(claimHTML())},
 claimLang:a=>{S.ui.claimLang=a.dataset.l;$('#modalCard').innerHTML=claimHTML()},
 claimTask:()=>{const s=ship(S.ui.claimSid),m=matchSum(s);addTask({id:nid(),t:'10:00',x:`Follow up ${usd(m.claim)} claim for ${s.ref} with ${PR().contact}`,c:'Supplier',w:'Me',done:false,day:'Tomorrow'});S.ui.sugDone.add('claim'+s.id);toast('Added to tomorrow at 10:00.')},
 copyTA:a=>{const el=$('#'+a.dataset.t);copyText(el.value,el)},
 copy:a=>copyText(a.dataset.v),
 confirmRecv:a=>{const s=ship(+a.dataset.id),m=matchSum(s);s.items.forEach(l=>{const p=prod(l.pid);p.stock+=Math.max(0,l.rc-l.dc)*p.per});s.confirmed=true;s.stage=stages(s).length-1;s.docs['Delivery note']=true;
  S.notifs.unshift({title:'Stock updated',body:`${fmtN(m.units)} units from ${s.ref} added to stock.`,t:'Just now',unread:true});
  if(S.autos.find(x=>x.id==='a2').on){S.ui.soc.pid=s.items[0].pid;S.ui.soc.v=0;S.ui.soc.preorder=false;S.ui.soc.caption=caption()}
  toast(`${fmtN(m.units)} units added to stock.${m.issues?' Send the claim to your supplier.':''}`);render()},
 postItem:a=>{const so=S.ui.soc;so.pid=+a.dataset.pid;so.preorder=false;so.caption=caption();S.ui.socialTab='create';setView('social')},
 stockTab:a=>{S.ui.stockTab=a.dataset.t;render()},
 selLow:()=>{S.ui.sel=new Set(S.products.filter(p=>p.stock<p.reorder&&!onOrder(p.id)).map(p=>p.id));if(!S.ui.sel.size)S.products.filter(p=>p.stock<p.reorder).forEach(p=>S.ui.sel.add(p.id));render()},
 reoRoute:a=>{S.ui.reo.route=a.dataset.r;$('#modalCard').innerHTML=reoHTML()},
 reoLang:a=>{S.ui.reo.lang=a.dataset.l;$('#modalCard').innerHTML=reoHTML()},
 reoDel:a=>{S.ui.reo.lines.splice(+a.dataset.i,1);$('#modalCard').innerHTML=reoHTML()},
 createOrder:()=>{const R=S.ui.reo,air=R.route==='air',d=addD(0);const s=mkShip({ref:'HON-'+yymm(d)+'-'+pad(15+S.shipments.length),route:R.route,stage:0,items:R.lines.map(l=>({pid:l.pid,oc:l.oc,rc:null,dc:0})),cno:'Not booked yet',bl:'Waiting for PI',via:air?'Guangzhou Baiyun to Entebbe':'Nansha to Mombasa, truck via Malaba',ordered:d,eta:addD(air?12:48),balancePaid:false,balanceDue:addD(air?6:20)});
  S.shipments.push(s);addTask({id:nid(),t:nextHour(),x:`Pay 30% deposit of ${usd0(shipUSD(s)*.3)} for ${s.ref}`,c:'Money',w:'Me',done:false,day:'Today'});S.ui.sel=new Set();S.ui.sugDone.add('low');S.ui.open[s.id]=true;S.ui.shipFilter='all';S.ui.scrollTo=s.id;closeModal();
  S.notifs.unshift({title:'New order created',body:`${s.ref} for ${usd0(shipUSD(s))} is now tracked.`,t:'Just now',unread:true});toast(`${s.ref} created. Deposit reminder added to your day.`);setView('shipments')},
 socialTab:a=>{S.ui.socialTab=a.dataset.t;S.ui.bkOpen=false;render()},
 socPrev:a=>{S.ui.soc.prev=a.dataset.p;render()},
 socNoImg:()=>{S.ui.soc.img=null;render()},
 socRewrite:()=>{S.ui.soc.v++;S.ui.soc.caption=caption();$('#socCap').value=S.ui.soc.caption;$('#socPreview').innerHTML=socPreview()},
 publish:()=>{const so=S.ui.soc,chs=CHANNELS.filter(c=>so.ch[c]);if(!chs.length){toast('Pick at least one channel.');return}const p=prod(so.pid),post={id:nid(),pid:p.id,ch:chs,when:'Just now',views:0,inq:0,img:so.img};S.posts.unshift(post);toast(`Posted to ${listJoin(chs)}.`);render();
  setTimeout(()=>{const names=['Joan A.','Musa K.','Patience T.','@kla.deals','Sharon M.','Wasswa R.'],nm=names[Math.floor(Math.random()*names.length)],ch=chs[0]==='WhatsApp Status'?'WhatsApp':chs[0],pre=so.preorder&&incomingFor(p.id),msg=pre?`I want to book ${p.name}. How much is the deposit?`:`Hi, I saw your post. Is ${p.name} available? What is the price for 2?`;
   const q={id:nid(),ch,name:nm,pid:p.id,t:'Now',status:'new',msgs:[{f:'them',x:msg}]};S.inquiries.unshift(q);post.inq++;post.views=Math.floor(300+Math.random()*900);pushBanner(`New inquiry on ${ch}`,`${nm}: ${msg}`,'social:inbox',q.id);if(S.ui.view==='social')render()},4200)},
 inqSel:a=>{S.ui.inq=+a.dataset.id;S.ui.bkOpen=false;render()},
 quick:a=>{const q=S.inquiries.find(x=>x.id===S.ui.inq),p=prod(q.pid),P=PR();const qr=[`Yes, it is available. ${p.name} is ${ugx(p.sell)}. How many do you need?`,`Wholesale for 1 ${p.pack} (${p.per} ${p.unit}) is ${ugx(Math.round(p.sell*p.per*.85/1000)*1000)}.`,`You can book now with 30% deposit on mobile money. We keep it for you until pickup.`,`We are in ${P.market}, Kampala. We also deliver upcountry by bus.`];const ta=$('#inqReply');ta.value=qr[+a.dataset.i];ta.focus()},
 sendReply:()=>{const q=S.inquiries.find(x=>x.id===S.ui.inq),v=$('#inqReply').value.trim();if(!v){toast('Write a reply or pick a quick reply first.');return}q.msgs.push({f:'me',x:v});if(q.status==='new')q.status='replied';toast(`Reply sent to ${q.name} on ${q.ch}.`);render()},
 bookOpen:()=>{S.ui.bkOpen=!S.ui.bkOpen;render()},
 bookSave:()=>{const q=S.inquiries.find(x=>x.id===S.ui.inq),qty=Math.max(1,+$('#bkQty').value||1),dep=Math.max(0,+$('#bkDep').value||0),from=$('#bkFrom').value;
  S.bookings.unshift({id:nid(),name:q.name,ch:q.ch,pid:q.pid,qty,deposit:dep,sid:from==='stock'?null:+from,done:false});q.msgs.push({f:'me',x:`Booked: ${fmtN(qty)} ${prod(q.pid).unit} of ${prod(q.pid).name}. Deposit ${ugx(dep)} received. We will notify you when it is ready.`});q.status='booked';S.ui.bkOpen=false;toast(`Booking saved for ${q.name}.`);render()},
 bkNotify:a=>{const b=S.bookings.find(x=>x.id===+a.dataset.id),s=b.sid?ship(b.sid):null;toast(`Update sent to ${b.name} on ${b.ch}${s&&!s.confirmed?`: goods at ${stages(s)[s.stage]}`:': ready for pickup'}.`)},
 bkDone:a=>{S.bookings.find(x=>x.id===+a.dataset.id).done=true;toast('Marked as picked up.');render()},
 pushPreset:a=>{setPushType(a.dataset.p);S.ui.push.when='now';setView('push')},
 pType:a=>{setPushType(a.dataset.t);render()},
 pWhen:a=>{S.ui.push.when=a.dataset.w;render()},
 pSend:()=>{const pu=S.ui.push,chs=Object.keys(pu.ch).filter(c=>pu.ch[c]);if(!chs.length){toast('Pick at least one channel.');return}if(!pu.title.trim()){toast('Add a title first.');return}const a=audiences().find(x=>x[0]===pu.aud),wl={now:'Just now',tomorrow:'Tomorrow 9:00',friday:'Friday 9:00'}[pu.when];
  S.sent.unshift({title:pu.title,aud:a[1],reach:a[2],ch:chs,when:wl,status:pu.when==='now'?'Sent':'Scheduled'});
  if(pu.when==='now'){toast(`Sent to ${fmtN(a[2])} ${a[1].toLowerCase()} on ${listJoin(chs)}. This is what they see.`);render();setTimeout(()=>pushBanner(pu.title,pu.body,''),500)}else{toast(`Scheduled for ${wl}.`);render()}},
 addTask:()=>{const el=$('#paAdd'),v=el.value.trim();if(!v){el.focus();return}const t=parseTask(v);addTask(t);toast(`Added for ${t.day.toLowerCase()} at ${t.t} under ${t.c}.`);render();const n=$('#paAdd');n&&n.focus()},
 delTask:a=>{S.tasks=S.tasks.filter(t=>t.id!==+a.dataset.id);render()},
 suggest:a=>{const x=sugList().find(s=>s[0]===a.dataset.k);if(!x)return;S.ui.sugDone.add(x[0]);addTask({id:nid(),t:nextHour(),x:x[1],c:x[2],w:x[3],done:false,day:'Today'});toast('Added to your day.');render()},
 paF:a=>{S.ui.paF=a.dataset.f;render()},
 payDone:a=>{const id=a.dataset.id;if(id[0]==='s'){ship(+id.slice(1)).balancePaid=true}else{const p=S.pays.find(x=>x.id===+id);if(p)p.paid=true}toast('Marked as paid.');render()},
 color:a=>{S.brand.color=a.dataset.c==='#0D6B62'?null:a.dataset.c;applyBrand();render()},
 logoReset:()=>{S.brand.logo=null;applyBrand();render()},
 plan:a=>{S.brand.plan=a.dataset.id;applyBrand();toast(`Switched to the ${PLANS.find(p=>p.id===a.dataset.id).n} plan.`);render()},
 bell:()=>drawer(),
 drawerClose:()=>{$('#drawer').hidden=true},
 readAll:()=>{S.notifs.forEach(n=>n.unread=false);drawer();navRender()},
 modalClose:()=>closeModal()
};
const CH={
 type:el=>{seed(el.value);save();applyBrand();toast(`Showing a ${PRESETS[el.value].label.toLowerCase()} trader.`);render()},
 toggleTask:el=>{const t=S.tasks.find(x=>x.id===+el.dataset.id);t.done=el.checked;render()},
 doc:el=>{ship(+el.dataset.id).docs[el.dataset.doc]=el.checked;render()},
 setv:el=>{const s=ship(S.ui.matchSid),l=s.items[+el.dataset.i],v=el.value===''?null:Math.max(0,Math.floor(+el.value));if(el.dataset.k==='rc'){l.rc=v;l.dc=Math.min(l.dc,v??0)}else l.dc=Math.min(v??0,l.rc??l.oc);render()},
 mSel:el=>{S.ui.matchSid=+el.value;render()},
 selP:el=>{const id=+el.dataset.id;el.checked?S.ui.sel.add(id):S.ui.sel.delete(id);render()},
 calcP:el=>{calcFromProduct(+el.value);render()},
 reoQty:el=>{S.ui.reo.lines[+el.dataset.i].oc=Math.max(1,Math.floor(+el.value||1));$('#modalCard').innerHTML=reoHTML()},
 socP:el=>{const so=S.ui.soc;so.pid=+el.value;if(!incomingFor(so.pid))so.preorder=false;so.caption=caption();render()},
 socOpt:el=>{S.ui.soc[el.dataset.k]=el.checked;S.ui.soc.caption=caption();render()},
 socCh:el=>{S.ui.soc.ch[el.dataset.c]=el.checked},
 socImg:el=>{const f=el.files&&el.files[0];if(!f)return;if(!/^image\//.test(f.type)){toast('That file is not a photo. Pick a JPG or PNG.');return}const r=new FileReader();r.onload=()=>{S.ui.soc.img=r.result;render()};r.readAsDataURL(f)},
 bkQty:el=>{const q=S.inquiries.find(x=>x.id===S.ui.inq),p=prod(q.pid);$('#bkDep').value=Math.round((+el.value||1)*p.sell*.3/1000)*1000},
 pAud:el=>{S.ui.push.aud=el.value},
 pCh:el=>{S.ui.push.ch[el.dataset.c]=el.checked},
 auto:el=>{S.autos.find(a=>a.id===el.dataset.id).on=el.checked;toast(el.checked?'Automation on.':'Automation off.')},
 assign:el=>{S.tasks.find(t=>t.id===+el.dataset.id).w=el.value;toast(`Assigned to ${el.value}.`)},
 logo:el=>{const f=el.files&&el.files[0];if(!f)return;if(!/^image\//.test(f.type)){toast('Pick an image file for the logo.');return}const r=new FileReader();r.onload=()=>{S.brand.logo=r.result;applyBrand();render();toast('Logo updated everywhere.')};r.readAsDataURL(f)},
 chan:el=>{S.brand.chan[el.dataset.k]=el.checked;save();toast(`${el.dataset.k} ${el.checked?'connected':'disconnected'}.`)}
};
const BIND={
 brand:el=>{S.brand[el.dataset.k]=el.value;applyBrand();const bp=$('#brandPrev');if(bp)bp.innerHTML=brandPrev();navRender()},
 brandColor:el=>{S.brand.color=el.value;applyBrand();const bp=$('#brandPrev');if(bp)bp.innerHTML=brandPrev()},
 soccap:el=>{S.ui.soc.caption=el.value;$('#socPreview').innerHTML=socPreview()},
 push:el=>{S.ui.push[el.dataset.k]=el.value;$('#pushPrev').innerHTML=lockHTML();$('#smsCount').textContent=smsInfo()},
 calc:el=>{const k=el.dataset.k,v=parseFloat(el.value);if(k==='rate'){if(v>0)S.rate=v}else S.ui.calc[k]=isNaN(v)?0:v;$('#calcOut').innerHTML=calcOut()}
};
document.addEventListener('click',e=>{if(e.target.id==='modal'){closeModal();return}const a=e.target.closest('[data-act]');if(!a||a.disabled)return;const f=ACT[a.dataset.act];if(f){e.preventDefault();f(a,e)}});
document.addEventListener('change',e=>{const el=e.target;if(el.dataset.ch&&CH[el.dataset.ch])CH[el.dataset.ch](el);else if(el.tagName==='SELECT'&&el.dataset.bind&&BIND[el.dataset.bind])BIND[el.dataset.bind](el)});
document.addEventListener('input',e=>{const el=e.target;if(el.dataset.bind&&BIND[el.dataset.bind])BIND[el.dataset.bind](el)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();$('#drawer').hidden=true}if(e.key==='Enter'&&e.target.id==='paAdd'){e.preventDefault();ACT.addTask()}});
document.addEventListener('dragover',e=>{const d=e.target.closest&&e.target.closest('#drop');if(d){e.preventDefault();d.classList.add('over')}});
document.addEventListener('dragleave',e=>{const d=e.target.closest&&e.target.closest('#drop');if(d)d.classList.remove('over')});
document.addEventListener('drop',e=>{const d=e.target.closest&&e.target.closest('#drop');if(!d)return;e.preventDefault();d.classList.remove('over');const f=e.dataTransfer.files[0];if(f&&/^image\//.test(f.type)){const r=new FileReader();r.onload=()=>{S.ui.soc.img=r.result;render()};r.readAsDataURL(f)}});

const VIEWS={today:vToday,shipments:vShipments,matching:vMatching,stock:vStock,social:vSocial,push:vPush,assistant:vAssistant,brand:vBrand};

/* ---------- Boot ---------- */
const hv=location.hash.slice(1);S.ui.view=VIEWS[hv]?hv:'today';
seed(S.type);applyBrand();render();
setTimeout(()=>{const t=S.tasks.filter(x=>x.day==='Today'&&!x.done).sort((a,b)=>a.t.localeCompare(b.t)).find(x=>x.c==='Supplier')||S.tasks.find(x=>!x.done);if(t)pushBanner(`Reminder · ${t.t}`,t.x,'assistant')},3500);
