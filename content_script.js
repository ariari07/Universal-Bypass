//If you want to insert your own bypass, please search for "Insertion point"
if(document instanceof HTMLDocument)
{
	let brws = (typeof browser == "undefined" ? chrome : browser)
	brws.runtime.sendMessage({}, res => {
		if(!res.enabled)
		{
			return
		}
		let script=document.createElement("script")
		script.innerHTML=`(()=>{
		const crowdEnabled=`+(res.crowdEnabled ? "true" : "false")+`,
		ODP=(t,p,o)=>{try{Object.defineProperty(t,p,o)}catch(e){console.trace("[Universal Bypass] Couldn't define",p)}},
		//Copying eval, etc. to prevent issues with other extensions, such as uBlockOrigin. Also, note that this is the page level, so there are no security risks in using eval.
		eval=window.eval,setTimeout=window.setTimeout,setInterval=window.setInterval,
		isGoodLink=link=>{
			if(!link||link==location.href||link.substr(0,6)=="about:"||link.substr(0,11)=="javascript:")
			{
				return false
			}
			try
			{
				new URL(link)
			}
			catch(e)
			{
				return false
			}
			return true
		},
		unsafelyNavigate=target=>{
			if(navigated)
				return
			navigated=true
			location.href="https://universal-bypass.org/before-navigate?target="+encodeURIComponent(target)
			//The background script will intercept the request and redirect to html/before-navigate.html or to the target depending on the user's settings.
		},
		safelyNavigate=target=>{
			if(navigated||!isGoodLink(target))
			{
				return false
			}
			bypassed=true
			let url
			try{url=new URL(target)}catch(e){}
			if(!url||!url.hash)
			{
				target+=location.hash
			}
			window.onbeforeunload=null
			unsafelyNavigate(target)
			return true
		},
		finish=()=>{
			bypassed=true
			document.documentElement.setAttribute("data-universal-bypass-stop-watching","")
		},
		domainBypass=(domain,f)=>{
			if(!bypassed&&(location.hostname==domain||location.hostname.substr(location.hostname.length-(domain.length+1))=="."+domain))
			{
				f()
				finish()
			}
		},
		hrefBypass=(regex,f)=>{
			if(!bypassed&&regex.test(location.href))
			{
				f()
				finish()
			}
		},
		ensureDomLoaded=f=>{
			if(["interactive","complete"].indexOf(document.readyState)>-1)
			{
				f()
			}
			else
			{
				document.addEventListener("DOMContentLoaded",()=>setTimeout(f,1))
			}
		},
		crowdBypass=f=>{
			if(crowdEnabled)
			{
				if(location.href.substr(location.href.length-18)=="#ignoreCrowdBypass")
				{
					document.querySelectorAll("form[action]").forEach(e=>e.action+="#ignoreCrowdBypass")
					document.querySelectorAll("a[href]").forEach(e=>e.href+="#ignoreCrowdBypass")
					history.pushState({},document.querySelector("title").textContent,location.href.substr(0,location.href.length-18))
					f()
				}
				else
				{
					document.documentElement.setAttribute("data-universal-bypass-crowd-query","")
					let iT=setInterval(()=>{
						if(document.documentElement.hasAttribute("data-universal-bypass-crowd-queried"))
						{
							document.documentElement.removeAttribute("data-universal-bypass-crowd-queried")
							f()
						}
					},20)
				}
			}
		},
		contributeAndNavigate=target=>{
			if(!navigated&&isGoodLink(target))
			{
				if(crowdEnabled)
				{
					document.documentElement.setAttribute("data-universal-bypass-crowd-contribute",target)
					let iT=setInterval(()=>{
						if(document.documentElement.hasAttribute("data-universal-bypass-crowd-contributed"))
						{
							document.documentElement.removeAttribute("data-universal-bypass-crowd-contributed")
							unsafelyNavigate(target)
						}
					},20)
				}
				else
				{
					unsafelyNavigate(target)
				}
			}
		}
		var navigated=false,
		bypassed=false,
		domain=location.hostname
		if(domain.substr(0,4)=="www.")
		{
			domain=domain.substr(4)
		}
		ODP(window,"blurred",{
			value:false,
			writable:false
		})
		//adf.ly
		ODP(window,"ysmm",
		{
			set:r=>{
				let a,m,I="",X=""
				for(m=0;m<r.length;m++)
				{
					if(m%2==0)
					{
						I+=r.charAt(m)
					}
					else
					{
						X=r.charAt(m)+X
					}
				}
				r=I+X
				a=r.split("")
				for(m=0;m<a.length;m++)
				{
					if(!isNaN(a[m]))
					{
						for(var R=m+1;R<a.length;R++)
						{
							if(!isNaN(a[R]))
							{
								let S=a[m]^a[R]
								if(S<10)
								{
									a[m]=S
								}
								m=R
								R=a.length
							}
						}
					}
				}
				r=a.join('')
				r=atob(r)
				r=r.substring(r.length-(r.length-16))
				r=r.substring(0,r.length-16)
				safelyNavigate(r)
			}
		})
		//LinkBucks
		var actualInitLbjs
		ODP(window,"initLbjs",{
			set:(_)=>actualInitLbjs=_,
			get:()=>(a,p)=>{
				p.Countdown--
				actualInitLbjs(a,p)
			}
		})
		//Safelink
		let actual_safelink=forced_safelink={counter:0,adblock:false}
		ODP(window,"safelink",
		{
			set:_=>{
				ODP(window,"blurred",{
					value:false,
					writable:false
				})
				for(let k in _)
				{
					if(forced_safelink[k]===undefined)
					{
						actual_safelink[k]=_[k]
					}
				}
			},
			get:()=>actual_safelink
		})
		for(let key in forced_safelink)
		{
			ODP(safelink,key,
			{
				writable:false,
				value:forced_safelink[key]
			})
		}
		//YetiShare
		let actual_web_root
		ODP(window,"WEB_ROOT",{
			set:v=>{
				ODP(window,"seconds",{
					value:0,
					writable:false
				})
				actual_web_root=v
			},
			get:()=>actual_web_root
		})
		//GemPixel Premium URL Shortener
		let actual_appurl,actual_token
		ODP(window,"appurl",{
			set:v=>{
				actual_appurl=v
			},
			get:()=>actual_appurl
		})
		ODP(window,"token",{
			set:v=>{
				actual_token=v
				if(actual_appurl)
				{
					window.setInterval=f=>setInterval(f,1)
				}
			},
			get:()=>actual_token
		})
		hrefBypass(/ur\\.ly|urly\\.mobi/,()=>{
			if(location.pathname.length>2&&location.pathname.substr(0,6)!="/goii/")
				safelyNavigate("/goii/"+location.pathname.substr(2)+"?ref="+location.hostname+location.pathname)
		})
		hrefBypass(/universal-bypass\\.org\\/firstrun/,()=>{
			location.href="https://universal-bypass.org/firstrun?1"
		})
		domainBypass("cshort.org",()=>{
			ODP(window,"adblock",{
				value:false,
				writable:false
			})
			ODP(window,"i",{
				value:0,
				writable:false
			})
			ensureDomLoaded(()=>
			{
				let lT=setInterval(()=>
				{
					if(document.querySelector(".next[href]"))
					{
						clearInterval(lT)
						safelyNavigate(atob(atob(document.querySelector(".next[href]").getAttribute("href"))))
					}
				},100)
			})
		})
		domainBypass("link.tl",()=>{
			ODP(window,"countdown",{
				value:0,
				writable:false
			})
			let lT=setInterval(()=>
			{
				if(document.querySelector(".skip > .btn"))
				{
					clearInterval(lT)
					document.querySelector(".skip > .btn").click()
				}
			},100)
		})
		domainBypass("onepiece-ex.com.br",()=>{
			ODP(window,"seconds",{
				value:1,
				writable:false
			})
			let lT=setInterval(()=>{
				if(document.getElementById("continuar"))
				{
					clearInterval(lT)
					safelyNavigate(document.getElementById("continuar").href)
				}
			},100)
		})
		domainBypass("akoam.net",()=>{
			ODP(window,"timer",{
				value:0,
				writable:false
			})
			let lT=setInterval(()=>{
				if(document.querySelector(".download_button"))
				{
					clearInterval(lT)
					safelyNavigate(document.querySelector(".download_button").href)
				}
			},100)
		})
		hrefBypass(/1v\\.to\\/t\\/.*/,()=>{
			location.pathname=location.pathname.split("/t/").join("/saliendo/")
		})
		domainBypass("share-online.biz",()=>{
			ODP(window,"wait",{
				set:s=>0,
				get:()=>{
					return 2
				}
			})
		})
		hrefBypass(/sfile\\.(mobi|xyz)/,()=>{
			ODP(window,"downloadButton",{
				set:b=>{
					if(b&&b.href)
						safelyNavigate(b.href)
				}
			})
		})
		domainBypass("mylink.zone",()=>{
			ODP(window,"seconde",{
				set:_=>{},
				get:()=>{
					return -1
				}
			})
		})
		domainBypass("sourceforge.net",()=>{
			var b=document.createElement("button"),d=false
			b.className="direct-download"
			b.style.display="none"
			document.documentElement.appendChild(b)
			ODP(window,"log",{
				value:m=>{
					console.log(m)
					if(m=="triggering downloader:start")
						d=true
				},
				writable:false
			})
			ensureDomLoaded(()=>{
				let bT=setInterval(()=>{
					if(d)
						clearInterval(bT)
					else b.click()
				},100)
		})
	})
	domainBypass("bc.vc",()=>{
		window.setInterval=f=>setInterval(f,800)
		crowdBypass(()=>{
			window.eval=c=>{
				let j=eval(c)
				if(j.message&&j.message.url)
				{
					contributeAndNavigate(j.message.url)
					return{}
				}
				return j
			}
		})
		let sT=setInterval(()=>{
			let a=document.querySelector(".skip_btt > #skip_btt")
			if(a)
			{
				clearInterval(sT)
				a.click()
			}
		},50)
	})
	domainBypass("shortly.xyz",()=>{
		if(location.pathname.substr(0,3)=="/r/")
		{
			document.getElementById=()=>({submit:()=>{
				let f=document.querySelector("form")
				f.action="/link#"+document.querySelector("input[name='id']").value
				f.submit()
			}})
		}
		else if(location.pathname=="/link")
		{
			let xhr=new XMLHttpRequest()
			xhr.onreadystatechange=()=>{
				if(xhr.readyState==4&&xhr.status==200)
					safelyNavigate(xhr.responseText)
			}
			xhr.open("POST","https://www.shortly.xyz/getlink.php",true)
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
			xhr.setRequestHeader("X-Requested-With","XMLHttpRequest")
			xhr.send("id="+location.hash.replace("#",""))
		}
	})
	//Insertion point 1 — insert bypasses running before the DOM is loaded above this comment
	hrefBypass(/linkasm\\.com|firefaucet\\.win\\/l\\/|emulator\\.games\\/download\\.php|2speed\\.net\\/file\\//,()=>{
		window.setInterval=f=>setInterval(f,1)
	})
	hrefBypass(/datei\\.to|id-share19\\.com/,()=>{
		window.setTimeout=f=>setTimeout(f,1)
	})
	if(bypassed)
	{
		return
	}
	ensureDomLoaded(()=>{
		domainBypass("adfoc.us",()=>{
			let b=document.querySelector(".skip[href]")
			if(b)
				safelyNavigate(b.href)
		})
		domainBypass("sub2unlock.com",()=>{
			if(location.pathname.substr(0,10)=="/link/get/")
			{
				safelyNavigate(document.getElementById("link").href)
			}
			else
			{
				let f=document.getElementById("getLinkNow")
				if(f)
					document.getElementById("getLinkNow").submit()
			}
		})
		domainBypass("srt.am",()=>{
			if(document.querySelector(".skip-container"))
			{
				let f=document.createElement("form")
				f.method="POST"
				f.innerHTML='<input type="hidden" name="_image" value="Continue">'
				f=document.documentElement.appendChild(f)
				f.submit()
			}
		})
		domainBypass("admy.link",()=>{
			let f=document.querySelector(".edit_link")
			if(f)
			{
				f.submit()
			}
		})
		domainBypass("ysear.ch",()=>{
			let b=document.querySelector("#NextVideo[href]")
			if(b)
			{
				safelyNavigate(b.href)
			}
		})
		hrefBypass(/1ink\\.(cc|live)/,()=>{
			if(typeof SkipAd=="function")
			{
				SkipAd()
			}
		})
		domainBypass("losstor.com",()=>{
			let b=document.getElementById("re_link")
			if(b)
			{
				window.open=safelyNavigate
				b.click()
			}
		})
		domainBypass("fshare.vn",()=>{
			if("$" in window)
			{
				let f=$("#form-download")
				if(f.length)
				{
					$.ajax({
						"url":f.attr("action"),
						"type":"POST",
						"data":f.serialize()
					}).done(data=>safelyNavigate(data.url))
				}
			}
		})
		domainBypass("dwindly.io",()=>{
			let b=document.getElementById("btd1")
			if(b)
			{
				window.open=()=>{}
				b.click()
			}
			else
			{
				b=document.getElementById("btd")
				if(b)
				{
					window.open=safelyNavigate
					eval("("+b.onclick.toString().split(";")[0]+"})()")
				}
			}
		})
		domainBypass("bluemediafiles.com",()=>{
			if(typeof FinishMessage=="string"&&FinishMessage.indexOf("<a href=")>-1)
			{
				//The FinishMessage string contains the HTML anchor element needed to get to the destination so we just replace the entire website with it because we don't need any of the other content anymore.
				document.write(FinishMessage)
				document.querySelector("a").click()
			}
		})
		domainBypass("complete2unlock.com",()=>{
			let bT=setInterval(()=>{
				let b=document.getElementById("link-success-button"),es=document.querySelectorAll(".unlockpanel")
				if(b&&es.length>0)
				{
					clearInterval(bT)
					window.open=()=>{}
					es.forEach(e=>e.dispatchEvent(new MouseEvent("click")))
					let dT=setInterval(()=>{
						if(!b.hasAttribute("disabled"))
						{
							clearInterval(dT)
							b.dispatchEvent(new MouseEvent("click"))
						}
					},100)
				}
			},300)
			setInterval(()=>clearInterval(bT),10000)
		})
		domainBypass("hidelink.club",()=>{
			if(hash)
				safelyNavigate(decodeURIComponent(atob(hash)).replace("%23", "#"))
		})
		domainBypass("won.pe",()=>
		{
			if(document.querySelector(".captcha_loader .progress-bar"))
				document.querySelector(".captcha_loader .progress-bar").setAttribute("aria-valuenow","100")
		})
		domainBypass("vipdirect.cc",()=>{
			if(typeof ab=="number"&&typeof asdf=="function")
			{
				ab=5
				window.open=safelyNavigate
				asdf()
			}
		})
		domainBypass("rapidcrypt.net",()=>{
			let b=document.querySelector(".push_button.blue[href]")
			if(b)
				safelyNavigate(b.href)
		})
		domainBypass("shrink-service.it",()=>{
			if(typeof $=="function"&&typeof $.ajax=="function"&&typeof screenApi=="function")
			{
				let _a=$.ajax
				$.ajax=a=>(a.data&&a.data.set_one?safelyNavigate(atob(a.data.set_one)):_a(a))
				screenApi()
			}
		})
		domainBypass("rom.io",()=>crowdBypass(()=>{
			let cT=setInterval(()=>{
				let a=document.querySelector("a.final-button[href]")
				if(a&&isGoodLink(a.href))
				{
					clearInterval(cT)
					a.parentNode.removeChild(a)
					contributeAndNavigate(a.href)
				}
			},50)
		}))
		domainBypass("show.co",()=>{
			let s=document.getElementById("show-campaign-data")
			if(s)
			{
				let d=JSON.parse(s.textContent)
				if(d&&"title"in d&&"unlockable"in d)
				{
					document.write("<body></body>")
					if("title"in d)
						["title","h1"].forEach(t=>{
							let e=document.createElement(t)
							e.textContent=d.title
							document.body.appendChild(e)
						})
						if("message"in d.unlockable)
						{
							let p=document.createElement("p")
							p.textContent=d.unlockable.message
							document.body.appendChild(p)
						}
						if("redirect"in d.unlockable&&"url"in d.unlockable.redirect)
						{
							let p=document.createElement("p"),a=document.createElement("a")
							a.textContent=a.href=d.unlockable.redirect.url
							p.appendChild(a)
							document.body.appendChild(p)
						}
						stop()
					}
				}
			})
			domainBypass("vcrypt.net",()=>{
				if(document.querySelector(".btncontinue"))
				{
					document.querySelector("form").submit()
				}
			})
			domainBypass("runtyurl.com",()=>{
				let b=document.getElementById("go_next")
				if(b&&isGoodLink(b.href))
				{
					location.href=b.href
				}
				else
				{
					b=document.getElementById("download")
					if(b)
					{
						safelyNavigate(b.href)
					}
				}
			})
			hrefBypass(/4snip\\.pw\\/out\\//,()=>{
				let f=document.querySelector("form[action^='../out2/']")
				f.setAttribute("action",f.getAttribute("action").replace("../out2/","../outlink/"))
				f.submit()
			})
			domainBypass("douploads.com",()=>{
				if(document.querySelectorAll(".seconds").length==1)
					document.querySelector(".seconds").textContent="1"
			})
			domainBypass("elsfile.org",()=>{
				let form=document.createElement("form")
				form.method="POST"
				form.innerHTML='<input type="hidden" name="op" value="download1"><input type="hidden" name="usr_login" value="C"><input type="hidden" name="id" value="'+location.pathname.toString().substr(1)+'"><input type="hidden" name="fname" value="'+document.querySelectorAll("div#container > div > div > table > tbody > tr > td")[2].textContent+'"><input type="hidden" name="referer" value="q"><input type="hidden" name="method_free" value="Free Download">'
				form=document.documentElement.appendChild(form)
				form.submit()
				return finish()
			})
			domainBypass("goou.in",()=>{
				let a=document.querySelector("div#download_link > a#download[href]")
				if(a)
				{
					safelyNavigate(a.href)
				}
			})
			domainBypass("skinnycat.org",()=>{
				let a=document.querySelector("a.redirect[href]")
				if(a)
				{
					safelyNavigate(a.href)
				}
			})
			domainBypass("ryn.cc",()=>{
				if(typeof countdown=="function")
				{
					document.write('<div id="link"><p id="timer">0</p></div>')
					countdown()
					safelyNavigate(document.querySelector("#link > a").href)
				}
			})
			domainBypass("connect-trojan.net",()=>{
				let a=document.querySelector("#post_download > a[onclick]")
				if(a)
				{
					redireciona=safelyNavigate
					a.onclick()
				}
			})
			domainBypass("shirosafe.web.id",()=>{
				safelyNavigate(document.querySelector("#generate > center > a[style]").href)
			})
			//Insertion point 2 — insert bypasses running after the DOM is loaded above this comment
			if(bypassed)
			{
				return
			}
			//Adf.ly "Locked" Page
			if(location.pathname=="/ad/locked"&&document.getElementById("countdown")&&document.querySelector("a").textContent=="Click here to continue")
			{
				let wT=setInterval(()=>{
					if(document.getElementById("countdown").textContent=="0")
					{
						clearInterval(wT)
						document.querySelector("a").click()
					}
				},100)
			}
			//Adf.ly Pre-Redirect Page
			if(location.pathname.substr(0,13)=="/redirecting/"&&document.querySelector("p[style]").textContent=="For your safety, never enter your password unless you're on the real Adf.ly site.")
			{
				let a=document.querySelector("a[href]")
				if(a)
				{
					safelyNavigate(a.href)
					return finish()
				}
			}
			//SafelinkU
			if(typeof app_vars=="object"&&document.querySelector("b[style='color: #3e66b3']")&&document.querySelector("b[style='color: #3e66b3']").textContent=="SafelinkU")
			{
				window.setInterval=(f)=>setInterval(f,10)
				return finish()
			}
			//Soralink Wordpress Plugin
			if(document.querySelector(".sorasubmit"))
			{
				document.querySelector(".sorasubmit").click()
				return finish()
			}
			if(document.querySelector("#lanjut > #goes[href]"))
			{
				safelyNavigate(document.querySelector("#lanjut > #goes[href]").href)
				return finish()
			}
			if(document.getElementById("waktu")&&document.getElementById("goto"))
			{
				safelyNavigate(document.getElementById("goto").href)
				return finish()
			}
			if(typeof bukalink=="function"&&document.getElementById("bijil1")&&document.getElementById("bijil2"))//gosavelink.com
			{
				window.open=safelyNavigate
				bukalink()
				return finish()
			}
			if(typeof changeLink=="function")
			{
				let cLT=setInterval(()=>{
					if((document.querySelectorAll("img#pleasewait").length&&document.querySelector(".wait"))
					||document.getElementById("showlink")
					||document.getElementById("download")
					||document.getElementsByTagName("style='margin-top:").length
					||document.querySelector(".Visit_Link")//yametesenpai.xyz
					||document.getElementById("daplong")//converthinks.xyz
					)
					{
						clearInterval(cLT)
						window.open=safelyNavigate
						if(typeof changeLink=="function")
						{
							changeLink()
						}
						else if(document.getElementById("link-download"))//hightech.web.id
						{
							safelyNavigate(document.getElementById("link-download").href)
						}
					}
				},100)
			}
			//Safelink Wordpress Plugin
			if(document.querySelector(".wp-safelink-button"))
			{
				window.setInterval=f=>setInterval(f,1)
				let lT=setInterval(()=>{
					if(document.querySelector(".wp-safelink-button.wp-safelink-success-color"))
					{
						clearInterval(lT)
						window.open=safelyNavigate
						document.querySelector(".wp-safelink-button.wp-safelink-success-color").click()
					}
				},100)
			}
			if(document.getElementById("wpsafe-generate")&&typeof wpsafegenerate=="function")
			{
				let a=document.querySelector("#wpsafegenerate > #wpsafe-link > a[href]")
				if(a)
				{
					safelyNavigate(a.href)
					return finish()
				}
				else
				{
					let s=new URLSearchParams(location.search)
					if(s.has("go"))
					{
						if(safelyNavigate(atob(s.get("go"))))
							return finish()
					}
					else if(location.pathname.toString().substr(0,4)=="/go/")
					{
						search=atob(location.pathname.toString().substr(4))
						if(search.substr(0,4)=="http")
						{
							safelyNavigate(search)
							return finish()
						}
					}
				}
			}
			if(document.querySelector("input[type='hidden'][name='newwpsafelink'][value]"))
			{
				let s=new URLSearchParams(location.search)
				if(s.has("go"))
				{
					safelyNavigate(atob(s.get("go")))
					return finish()
				}
			}
			//Other Templates
			if(document.querySelector(".timed-content-client_show_0_30_0"))//technicoz.com
			{
				document.querySelector(".timed-content-client_show_0_30_0").classList.remove("timed-content-client_show_0_30_0")
				return finish()
			}
			if(document.getElementById("getlink")&&document.getElementById("gotolink")&&document.getElementById("timer"))//tetewlink.me,vehicle-techno.cf
			{
				document.getElementById("gotolink").removeAttribute("disabled")
				document.getElementById("gotolink").click()
				return finish()
			}
			if(document.querySelector("#tungguyabro")&&typeof WaktunyaBro=="number")//short.mangasave.me
			{
				WaktunyaBro=0
				setInterval(()=>{
					if(document.querySelector("#tungguyabro a[href]"))
						safelyNavigate(document.querySelector("#tungguyabro a[href]").href)
				},100)
				return finish()
			}
			if(document.querySelector("#yangDihilangkan > a")&&document.querySelector("#downloadArea > .text-center"))//rathestation.bid
			{
				safelyNavigate(document.querySelector("#yangDihilangkan > a").href)
				return finish()
			}
			if(document.querySelector("a#btn-main.disabled")&&typeof Countdown=="function")//Croco,CPMLink,Sloomp.space
			{
				safelyNavigate(document.querySelector("a#btn-main.disabled").href)
				return finish()
			}
			if(document.querySelector("a.redirectBTN.disabled")&&document.querySelector(".timer"))//Arablionz.online
			{
				safelyNavigate(document.querySelector("a.redirectBTN.disabled").href)
				return finish()
			}
			if(typeof generate=="function")//lewat.wibuindo.com
			{
				let b=document.querySelector("#download > a.akani[href]")
				if(b)
				{
					safelyNavigate(b.href)
				}
			}
			if(document.querySelector(".shortened_link a[href][ng-href][target='_blank']"))//Go2to.com,Go2too.com,Golink.to
			{
				safelyNavigate(document.querySelector(".shortened_link a[href][ng-href][target='_blank']").href)
			}
			if(document.querySelector("a[href^='https://linkshrink.net/homepage'] > img.lgo"))//LinkShrink.net
			{
				let p=document.getElementById("pause"),s=document.getElementById("skip")
				if(p&&s)
				{
					//Automating the click seems to not always work due to ads so we're only skipping the timer
					p.style.display="none"
					s.style.display="block"
				}
			}
			if(typeof x!="undefined")
			{
				if(document.querySelector("a.navbar-brand.logo-image[href='/'] > img[src='/img/4.png']"))//gslink.co
				{
					let a=document.querySelector("a.btnx[href][onclick]")
					if(a)
					{
						safelyNavigate(a.href+"&ab=1")
						return finish()
					}
					else
					{
						let b=document.querySelector("form[method='POST'] > input.btn[type='submit'][name='btn']")
						if(b)
						{
							b.click()
							return finish()
						}
					}
				}
				else if(document.querySelector(".img-responsive[alt='Gets URL']"))//gsul.me
				{
					let b=document.getElementById("link")
					if(b)
					{
						safelyNavigate(b.href+"&ab=1")
						return finish()
					}
				}
			}
			if(document.querySelector(".top-bar a[href='https://linkvertise.net']")&&typeof app!="undefined"&&app.handleRedirect)//Linkvertise.net
			{
				app.countdown=0
				$.post=(u,c)=>c()
				app.handleRedirect()
			}
			if(document.querySelectorAll("img[src='/assets/img/logo.png'][alt='Openload']").length)//OpenLoad
			{
				if(typeof secondsdl!="undefined")
				{
					secondsdl=0
				}
				return finish()
			}
			//SafeLinkReview.com
			if(document.querySelector(".navbar-brand")&&document.querySelector(".navbar-brand").textContent.trim()=="Safe Link Review"&&document.querySelector(".button.green"))
			{
				window.open=safelyNavigate
				document.querySelector(".button.green").click()
				return finish()
			}
			if(location.hostname=="decrypt2.safelinkconverter.com"&&document.querySelector(".redirect_url > div[onclick]"))
			{
				window.open=safelyNavigate
				document.querySelector(".redirect_url > div[onclick]").click()
				return finish()
			}
			//Shorte.st
			if(typeof app!="undefined"&&document.querySelector(".skip-add-container .first-img[alt='Shorte.st']"))
			{
				window.setInterval=f=>setInterval(f,500)
				let dUC=window.decodeURIComponent
				window.decodeURIComponent=c=>{
					c=dUC(c)
					safelyNavigate(c)
					return c
				}
				crowdBypass(()=>{
					window.decodeURIComponent=c=>{
						c=dUC(c)
						document.querySelector(".skip-add-container").textContent=""
						contributeAndNavigate(c)
						return c
					}
				})
				return
			}
			let t=document.querySelector("title")
			if(t)
			{
				t=t.textContent.trim()
				if(t=="Viid.su")//Viid.su
				{
					let b=document.getElementById("link-success-button")
					if(b&&b.getAttribute("data-url"))
					{
						safelyNavigate(b.getAttribute("data-url"))
						return finish()
					}
				}
				else
				{
					let b=document.querySelector("a#makingdifferenttimer[href]")
					if(b)
					{
						if(isGoodLink(t))
						{
							unsafelyNavigate(t)
						}
						else
						{
							safelyNavigate(b.href)
						}
					}
				}
			}
			//Monitor DOM for disturbances for 3 seconds.
			let dT=setInterval(()=>{
				//Shorte.st Embed
				if(document.querySelector(".lay-sh.active-sh"))
				{
					let elm=document.querySelectorAll(".lay-sh.active-sh")[0]
					elm.parentNode.removeChild(elm)
				}
				//AdLinkFly
				if(typeof app_vars=="object")
				{
					document.documentElement.setAttribute("data-universal-bypass-adlinkfly-info","")
					let iT=setInterval(()=>{
						if(document.documentElement.hasAttribute("data-universal-bypass-adlinkfly-target"))
						{
							clearInterval(iT)
							let t=document.documentElement.getAttribute("data-universal-bypass-adlinkfly-target")
							if(t=="")
							{
								crowdBypass(()=>{
									let cT=setInterval(()=>{
										let a=document.querySelector("a.get-link")
										if(!a)
										{
											a=document.querySelector(".skip-ad a[href]")
											if(!a)
											{
												a=document.querySelector("[enlace]")//adigp.com
											}
										}
										if(a)
										{
											h=a.href
											if(!isGoodLink(h)&&a.hasAttribute("data-href"))//cuio.io
											{
												h=a.getAttribute("data-href")
											}
											if(!isGoodLink(h)&&a.hasAttribute("enlace"))
											{
												h=a.getAttribute("enlace")
											}
											if(isGoodLink(h))
											{
												clearInterval(cT)
												a.parentNode.removeChild(a)
												contributeAndNavigate(h)
											}
										}
									},20)
								})
							}
							else
							{
								contributeAndNavigate(t)
							}
						}
					},50)
					domainBypass("oke.io",()=>window.setInterval=f=>setInterval(f,1))
					clearInterval(dT)
				}
			},100)
			setTimeout(()=>{
				clearInterval(dT)
				finish()
			},30000)
		})`
		let dO=new MutationObserver(mutations=>{
			if(document.documentElement.hasAttribute("data-universal-bypass-stop-watching"))
			{
				document.documentElement.removeAttribute("data-universal-bypass-stop-watching")
				dO.disconnect()
			}
			else if(document.documentElement.hasAttribute("data-universal-bypass-crowd-query"))
			{
				document.documentElement.removeAttribute("data-universal-bypass-crowd-query")
				let xhr=new XMLHttpRequest()
				xhr.onreadystatechange=()=>{
					if(xhr.readyState==4&&xhr.status==200&&xhr.responseText!="")
					{
						location.href="https://universal-bypass.org/crowd-bypassed?target="+encodeURIComponent(xhr.responseText)+"&back="+encodeURIComponent(location.href)
						//The background script will intercept the request and redirect to html/crowd-bypassed.html
					}
					else
					{
						document.documentElement.setAttribute("data-universal-bypass-crowd-queried","")
					}
				}
				xhr.open("POST","https://universal-bypass.org/crowd/query_v1",true)
				xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
				xhr.send("domain="+encodeURIComponent(domain)+"&path="+encodeURIComponent(location.pathname.toString().substr(1)))
			}
			else if(document.documentElement.hasAttribute("data-universal-bypass-crowd-contribute"))
			{
				let target=document.documentElement.getAttribute("data-universal-bypass-crowd-contribute"),
				xhr=new XMLHttpRequest()
				document.documentElement.removeAttribute("data-universal-bypass-crowd-contribute")
				xhr.onreadystatechange=()=>{
					if(xhr.readyState==4)
					{
						document.documentElement.setAttribute("data-universal-bypass-crowd-contributed","")
					}
				}
				xhr.open("POST","https://universal-bypass.org/crowd/contribute_v1",true)
				xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
				xhr.send("domain="+encodeURIComponent(domain)+"&path="+encodeURIComponent(location.pathname.toString().substr(1))+"&target="+encodeURIComponent(target))
			}
			else if(document.documentElement.hasAttribute("data-universal-bypass-adlinkfly-info"))
			{
				document.documentElement.removeAttribute("data-universal-bypass-adlinkfly-info")
				let xhr=new XMLHttpRequest(),t="",iu=location.href
				xhr.onreadystatechange=()=>{
					if(xhr.readyState==4)
					{
						if(xhr.status==200)
						{
							let i=new DOMParser().parseFromString(xhr.responseText,"text/html").querySelector("img[src^='//api.miniature.io']")
							if(i)
							{
								let url=new URL(i.src)
								if(url.search&&url.search.indexOf("url="))
									t=decodeURIComponent(url.search.split("url=")[1].split("&")[0])
							}
						}
						document.documentElement.setAttribute("data-universal-bypass-adlinkfly-target",t)
					}
				}
				if(iu.substr(iu.length - 1) != "/")
				{
					iu += "/"
				}
				xhr.open("GET", iu+"info", true)
				xhr.send()
			}
		}),
		domain=location.hostname
		if(domain.substr(0,4)=="www.")
		{
			domain=domain.substr(4)
		}
		dO.observe(document.documentElement,{attributes:true})
		script.innerHTML+="\n"+res.userscript+"\n})()"
		script=document.documentElement.appendChild(script)
		setTimeout(()=>document.documentElement.removeChild(script),10)
	})
}
