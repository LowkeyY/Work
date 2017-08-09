window.lg = function(msg) {
	console.log(msg);
}

lib.rdp.PackageDecoder = function() {
	this.reset();
}
lib.rdp.PackageDecoder.prototype = {
	reset : function() {
		this.historyoff = 0;
		this.history = new Array(65536);
		this.currOff = 0;
		this.currLen = 0;
	},
	getData : function() {
		var a = new lib.rdp.DataPackage(this.history, this.currOff,
				this.currLen);
		a.markEnd(this.currOff + this.currLen);
		return a
	},
	dec : function(a, b, d, c) {
		var f, e = 0, j = 0, k, l, g, h, m = 0 != (c & 1), p = this.history;
		if (0 == (c & 32))
			return this.currOff = 0, this.currLen = d, 0;
		if (0 != (c & 64))
			this.historyoff = 0;
		if (0 != (c & 128)) {
			for (c = 65536; 0 <= --c;)
				p[c] = 0;
			this.historyoff = 0
		}
		this.currLen = this.currOff = 0;
		this.currOff = g = k = c = this.historyoff;
		if (0 == d)
			return 0;
		d += j;
		do {
			if (0 == e) {
				if (j >= d)
					break;
				c = (a[b + j++] & 255) << 24;
				e = 8
			}
			if (0 <= c) {
				if (8 > e) {
					if (j >= d) {
						if (0 != c)
							return -1;
						break
					}
					c |= (a[b + j++] & 255) << 24 - e;
					e += 8
				}
				if (65536 <= k)
					return -1;
				p[k++] = c >>> 24 & 255;
				c <<= 8;
				e -= 8
			} else {
				c <<= 1;
				if (0 == --e) {
					if (j >= d)
						return -1;
					c = (a[b + j++] & 255) << 24;
					e = 8
				}
				if (0 <= c) {
					if (8 > e) {
						if (j >= d)
							return -1;
						c |= (a[b + j++] & 255) << 24 - e;
						e += 8
					}
					if (65536 <= k)
						return -1;
					p[k++] = (c >>> 24 | 128) & 255;
					c <<= 8;
					e -= 8
				} else {
					c <<= 1;
					if (--e < (m ? 3 : 2)) {
						if (j >= d)
							return -1;
						c |= (a[b + j++] & 255) << 24 - e;
						e += 8
					}
					if (m)
						switch (c >>> 29) {
							case 7 :
								for (; 9 > e; e += 8) {
									if (j >= d)
										return -1;
									c |= (a[b + j++] & 255) << 24 - e
								}
								c <<= 3;
								f = c >>> 26;
								c <<= 6;
								e -= 9;
								break;
							case 6 :
								for (; 11 > e; e += 8) {
									if (j >= d)
										return -1;
									c |= (a[b + j++] & 255) << 24 - e
								}
								c <<= 3;
								f = (c >>> 24) + 64;
								c <<= 8;
								e -= 11;
								break;
							case 5 :
							case 4 :
								for (; 13 > e; e += 8) {
									if (j >= d)
										return -1;
									c |= (a[b + j++] & 255) << 24 - e
								}
								c <<= 2;
								f = (c >>> 21) + 320;
								c <<= 11;
								e -= 13;
								break;
							default :
								for (; 17 > e; e += 8) {
									if (j >= d)
										return -1;
									c |= (a[b + j++] & 255) << 24 - e
								}
								c <<= 1;
								f = (c >>> 16) + 2368;
								c <<= 16;
								e -= 17
						}
					else
						switch (c >>> 30) {
							case 3 :
								if (8 > e) {
									if (j >= d)
										return -1;
									c |= (a[b + j++] & 255) << 24 - e;
									e += 8
								}
								c <<= 2;
								f = c >>> 26;
								c <<= 6;
								e -= 8;
								break;
							case 2 :
								for (; 10 > e; e += 8) {
									if (j >= d)
										return -1;
									c |= (a[b + j++] & 255) << 24 - e
								}
								c <<= 2;
								f = (c >>> 24) + 64;
								c <<= 8;
								e -= 10;
								break;
							default :
								for (; 14 > e; e += 8) {
									if (j >= d)
										return -1;
									c |= (a[b + j++] & 255) << 24 - e
								}
								f = (c >>> 18) + 320;
								c <<= 14;
								e -= 14
						}
					if (0 == e) {
						if (j >= d)
							return -1;
						c = (a[b + j++] & 255) << 24;
						e = 8
					}
					if (0 <= c)
						l = 3, c <<= 1, e--;
					else {
						h = m ? 14 : 11;
						do {
							c <<= 1;
							if (0 == --e) {
								if (j >= d)
									return -1;
								c = (a[b + j++] & 255) << 24;
								e = 8
							}
							if (0 <= c)
								break;
							if (0 == --h)
								return -1
						} while (1);
						l = (m ? 16 : 13) - h;
						c <<= 1;
						if (--e < l)
							for (; e < l; e += 8) {
								if (j >= d)
									return -1;
								c |= (a[b + j++] & 255) << 24 - e
							}
						h = l;
						l = c >>> 32 - h & ~(-1 << h) | 1 << h;
						c <<= h;
						e -= h
					}
					if (65536 <= k + l)
						return -1;
					f = k - f & (m ? 65535 : 8191);
					do
						p[k++] = p[f++];
					while (0 != --l)
				}
			}
		} while (1);
		this.historyoff = k;
		this.currOff = g;
		this.currLen = k - g;
		return 0
	}
};

lib.rdp.Protocol = function() {// 单例
	var PackageDecoder = new lib.rdp.PackageDecoder();// 不太清楚和实例有没有关系.
	var C = 0, H = 0, G = 0, E = 0, Za = null;// 声音
	var ra = 16777215;
	var ob = 0;// 颜色模板
	var sa = 0, oa = 0, fa = 0, ja = 0;

	function processRdpPackage(instance, a) {
		lg("  recive rdp4 packe");
		var b = a.getLittleEndian16(), d = a.getByte(), c = a.getByte(), i = a
				.getLittleEndian16(), e = null;
		if (0 != (c & 32)) {
			if (65536 < b)
				throw "Invalid package size for decompression.";
			if (-1 == PackageDecoder.dec(a.getData(), a.getPosition(), i - 18,
					c))
				throw "Error on decompressing data.";
			e = PackageDecoder.getData()
		} else
			e = a;
		switch (d) {
			case 2 :
				d = e;
				a = d.getLittleEndian16();
				switch (a) {
					case 0 :
						d.skipPosition(2);
						a = d.getLittleEndian16();
						d.skipPosition(2);
						processOrders(instance, d, a);
						break;
					case 1 :
						processBitmapUpdates(instance, d);
						break;
					case 2 :
						processPalette(instance, d);
						break;
					case 3 :
						break;
					default :
						lg("Warn: Unimplemented Update type " + a)
				}
				break;
			case 20 :
				break;
			case 31 :
				break;
			case 27 :
				d = e;
				a = 0;
				a = d.getLittleEndian16();
				d.skipPosition(2);
				switch (a) {
					case 3 :
						d.skipPositon(4);
						break;
					case 6 :
						processColorPointerPdu(instance, d, 24);
						break;
					case 7 :
						d = d.getLittleEndian16();
						instance.setCursor(d);
						break;
					case 1 :
						d = d.getLittleEndian16();
						switch (d) {
							case 0 :
								instance.setCursor("default");
								break;
							default :
								lg("XXX system pointer message " + d)
						}
						break;
					case 8 :
						a = d.getLittleEndian16(), processColorPointerPdu(
								instance, d, a)
				}
				break;
			case 34 :
				break;
			case 38 :
				// processSessionStorage(instance, e);
				break;
			case 47 :
				d = e.getLittleEndian32();
				1 > d || reportErrorMessageFunction(d);
				break;
			case 54 :
				a = e.getLittleEndian32().toString(16).toUpperCase(), instance.displayMsg
						&& Ext.msg("INFO", a);
			default :
				lg("warn: Unimplemented Data PDU type " + d)
		}
	}

	function processRdp5Package(instance, a) {
		var b = a.getByte(), d, c = 0;
		0 != (b & 128) && (c = a.getByte(), b ^= 128);
		d = a.getLittleEndian16();
		var i = null;
		if (0 != (c & 32)) {
			if (-1 == PackageDecoder.dec(a.getData(), a.getPosition(), d, c))
				throw "Error on decompressing data.";
			i = PackageDecoder.getData()
		} else
			i = a;
		switch (b) {
			case 0 :/* orders */
				a = i.getLittleEndian16();
				processOrders(instance, i, a);
				break;
			case 1 :/* bitmap update (???) */
				i.skipPosition(2);
				processBitmapUpdates(instance, i);
				break;
			case 2 :/* palette */
				i.skipPosition(2);
				processPalette(instance, i);
				break;
			case 3 :
				break;
			case 5 :
				instance.setCursor("default");
				break;
			case 6 :
				break;
			case 8 :
				break;
			case 9 :
				processColorPointerPdu(instance, i, 24);
				break;
			case 10 :
				i = i.getLittleEndian16();
				instance.setCursor(i);
				break;
			case 11 :
				a = i.getLittleEndian16();
				processColorPointerPdu(instance, i, a);
				break;
			default :
				lg("XXX RDP5 opcode " + b)
		}
	}

	function Ud(a, b, d, c, i, e, t, k) {
		this.x = a;
		this.y = b;
		this.width = d;
		this.height = c;
		this.mask = i;
		this.pixel = e;
		this.bpp = t;
		this.cache_idx = k
	}
	function processColorPointerPdu(instance, a, b) {
		if (!instance.noCursor) {
			// var icc=a.getPosition();
			var d = 0, c = 0, i = 0, e = 0, t = 0, k = 0, l = 0, t = a
					.getLittleEndian16(), d = a.getLittleEndian16(), c = a
					.getLittleEndian16(), i = a.getLittleEndian16(), e = a
					.getLittleEndian16(), k = a.getLittleEndian16(), l = a
					.getLittleEndian16(), l = a.getBytes(l), k = a.getBytes(k);
			// var ice=a.getPosition();
			// a.setPosition(icc)
			// lg(t+"--"+a.getBytes(ice-icc).join('|'))

			if (0 > d || d >= i - 1)
				d = 0;
			0 > c ? c = 0 : c >= e && (c = e - 1);

			l = new Ud(d, c, i, e, k, l, b, t);
			if (!Ext.isOpera) {
				var c = l.x, i = l.y, k = l.width, e = l.height, d = l.cache_idx, g = l.mask, h = l.pixel, m = l.bpp, l = Array(k
						* e), f = 0, n = 0, j, p;
				for (j = 0; j < e; j++)
					for (p = 0; p < k; p++) {
						n = j;
						1 != m && (n = e - n - 1);
						n = n * k + p;
						n = 0 == (g[Math.floor(n / 8)] & 128 >> n % 8) ? 1 : 0;
						l[f] = Wd(p, j, k, e, m, h);
						if (0 == n && 0 != l[f])
							l[f] = ~l[f], l[f] |= 4278190080;
						else if (1 == n || 0 != l[f])
							l[f] |= 4278190080;
						f++
					}
				h = 4 * k * e;
				m = k * e / 8;
				g = 62 + h + m + m;
				g = new lib.rdp.DataPackage(Array(g), 0, g);
				g.setLittleEndian16(0);
				g.setLittleEndian16(2);
				g.setLittleEndian16(1);
				g.setByte(k);
				g.setByte(e);
				g.setByte(0);
				g.setByte(0);
				g.setLittleEndian16(c);
				g.setLittleEndian16(i);
				g.setLittleEndian32(40 + h + m + m);
				g.setLittleEndian32(22);
				g.setLittleEndian32(40);
				g.setLittleEndian32(k);
				g.setLittleEndian32(2 * e);
				g.setLittleEndian16(1);
				g.setLittleEndian16(32);
				g.setLittleEndian32(0);
				g.setLittleEndian32(m + m);
				g.setLittleEndian32(0);
				g.setLittleEndian32(0);
				g.setLittleEndian32(0);
				g.setLittleEndian32(0);
				for (h = e - 1; 0 <= h; h--)
					for (m = 0; m < k; m++)
						f = l[k * h + m], g.setByte(f & 255), g.setByte(f >> 8
								& 255), g.setByte(f >> 16 & 255), g
								.setByte(f >> 24 & 255);
				k = Math.floor(k / 8);
				for (h = 0; h < e; h += 1)
					for (m = 0; m < k; m += 1)
						g.setByte(0);
				for (h = 0; h < e; h += 1)
					for (m = 0; m < k; m += 1)
						g.setByte(0);
				c = {
					data : "data:image/x-icon;base64,"
							+ lib.rdp.Base64.enc(g.getData()),
					hotX : c,
					hotY : i
				};
				if (20 > d)
					instance.cursorCache[d] = c;
				else
					throw "Could not put Cursor!";
			}
			instance.setCursor(t)
		}
	}
	function Wd(a, b, d, c, i, e) {
		1 != i && (b = c - b - 1);
		b = (b * d + a) * i;
		d = Math.floor(b / 8);
		a = e[d] & 255;
		switch (i) {
			case 1 :
				return 0 == (a & 128 >> b % 8) ? 0 : 4294967295;
			case 8 :
				return 0 == a ? 0 : 4294967295;
			case 15 :
				return a |= (e[d + 1] & 255) << 8, i = Array(4), adjustColorDepth(
						instance, a, 15, i, 0), i[0] << 16 | i[1] << 8 | i[2];
			case 16 :
				return a |= (e[d + 1] & 255) << 8, i = Array(4), adjustColorDepth(
						instance, a, 16, i, 0), i[0] << 16 | i[1] << 8 | i[2];
			case 24 :
				return (e[d + 2] & 255) << 16 | (e[d + 1] & 255) << 8 | a;
			case 32 :
				return (e[d + 3] & 255) << 24 | (e[d + 2] & 255) << 16
						| (e[d + 1] & 255) << 8 | a;
			default :
				throw new RdpException("invalid bpp value for Xor Mask.");
		}
	}
	function processPalette(instance, a) {
		var b = 0, d = null, c = null, i = null, e = 0;
		a.skipPosition(2);
		b = a.getLittleEndian16();
		a.skipPosition(2);
		for (var d = Array(b), c = Array(b), i = Array(b), a = a
				.getBytes(3 * b), t = 0; t < b; t++)
			d[t] = a[e], c[t] = a[e + 1], i[t] = a[e + 2], e += 3;
		256 == b
				&& (null == instance.defaultPalett
						&& (instance.defaultPalett = Array(3)), instance.defaultPalett[0] = d, instance.defaultPalett[1] = c, instance.defaultPalett[2] = i)
	}
	function processOrders(instance, a, b) {
		lg("       recive order length" + b);
		for (var d = 0, c = 0; d < b;) {
			// lg("pass-"+d);
			c = a.getByte();
			if (0 == (c & 1)) {
				var i = c >> 2;
				if (2 != (c & 3)) {
					// throw "Not a valid Alt secondary order";
				}
				switch (i) {
					case 11 :
						lg("@order 11 command" + i)
						break;
					default :
						lg("XXX Alt Sec order not implemented:" + i)
				}

			} else if (0 != (c & 2)) {
				var Tb = a, wa = void 0, L = void 0, Q = void 0, ma = void 0, wa = Tb
						.getLittleEndian16(), Q = Tb.getLittleEndian16(), L = Tb
						.getByte(), ma = Tb.getPosition() + wa + 7;
				switch (L) {
					case 0 :
						lg("TODO: raw bitmap cache");
						break;
					case 1 :
						lg("TODO: color cache");
						break;
					case 2 :
						var eb = Tb, ra = Q, Na = eb.getByte();
						eb.getByte();
						var za = eb.getByte(), xa = eb.getByte(), X = eb
								.getByte(), $ = eb.getLittleEndian16(), Ma = eb
								.getLittleEndian16(), ga = 0;
						0 != (ra & 1024)
								? ga = $
								: (eb.skipPosition(2), ga = eb
										.getLittleEndian16(), eb
										.skipPosition(2), eb.skipPosition(2));
						var z = Na, Ba = Ma, s = new bitmapCacheItem(eb
										.getBytes(ga), za, xa, 0, 0, X);
						"undefined" == typeof instance.bitmapCache[z]
								&& (instance.bitmapCache[z] = []);
						instance.bitmapCache[z][Ba] = s;
						break;
					case 3 :
						for (var Gb = Tb, $a = null, Ad = 0, Ya = 0, Bd = 0, S = 0, ab = 0, Ha = 0, hd = 0, Cd = 0, Ad = Gb
								.getByte(), Ya = Gb.getByte(), Qe = 0; Qe < Ya; Qe++) {
							var Bd = Gb.getLittleEndian16(), S = Gb
									.getLittleEndian16(), ab = Gb
									.getLittleEndian16(), Ha = Gb
									.getLittleEndian16(), hd = Gb
									.getLittleEndian16(), Cd = hd
									* Math.floor((Ha + 7) / 8) + 3 & -4, I = $a = new fontCacheItem(
									Ad, Bd, S, ab, Ha, hd, Gb.getBytes(Cd));
							if (12 > I.font && 256 > I.character)
								instance.fontCache[I.font][I.character] = I;
							else
								throw lg("put font: font=" + I.font + " c="
										+ I.character), "Could not put font in cache";
						}
						break;
					case 4 :
						lg("TODO: bmp cache 2");
						break;
					case 5 :
						lg("TODO: bmp compressed cache2");
						var eb = Tb;
						var cache_id = ra & 7, bpp = ((ra & 56) >> 3) - 2;
						var width = eb.getByte(), height = eb.getByte(), bufsize = eb
								.getBigEndian16(), cache_idx = eb.getByte();
						if ((cache_idx & 128) != 0) {
							cache_idx_low = eb.getByte();
							cache_idx = ((cache_idx ^ 128) << 8)
									+ cache_idx_low;
						}
						bufsize &= 16383;
						var z = cache_id, Ba = cache_idx;
						// var bmp=
						// lib.rdp.Bitmap.decompressInt(eb.getBytes(bufsize),
						// width, height,bpp);
						var s = new bitmapCacheItem(eb.getBytes(bufsize),
								width, height, 0, 0, bpp);
						"undefined" == typeof instance.bitmapCache[z]
								&& (instance.bitmapCache[z] = []);
						instance.bitmapCache[z][Ba] = s;
						break;
					default :
						lg("XXX second Order, type=" + L)
				}
				Tb.setPosition(ma)
			} else
				a : {
					var D = a, Pa = c, ba = 0, T = 0, O = false;
					if (0 == (Pa & 1))
						throw "Not a standard order!";
					if (0 != (Pa & 8))
						instance.orderType = D.getByte();
					switch (instance.orderType) {
						case 14 :
						case 27 :
							T = 3;
							break;
						case 1 :
						case 13 :
						case 9 :
							T = 2;
							break;
						default :
							T = 1
					}
					var tb = D, da = T, A = 0, Dd = 0;
					0 != (Pa & 64) && da--;
					0 != (Pa & 128) && (da = 2 > da ? 0 : da - 2);
					for (var r = 0; r < da; r++)
						Dd = tb.getByte(), A |= Dd << 8 * r;
					ba = A;
					if (0 != (Pa & 4)) {
						if (0 == (Pa & 32)) {
							var fb = D, aa = instance.bounds, Qa = fb.getByte();
							if (0 != (Qa & 1))
								aa.left = B(fb, aa.left, false);
							else if (0 != (Qa & 16))
								aa.left = B(fb, aa.left, true);
							if (0 != (Qa & 2))
								aa.top = B(fb, aa.top, false);
							else if (0 != (Qa & 32))
								aa.top = B(fb, aa.top, true);
							if (0 != (Qa & 4))
								aa.right = B(fb, aa.right, false);
							else if (0 != (Qa & 64))
								aa.right = B(fb, aa.right, true);
							if (0 != (Qa & 8))
								aa.bottom = B(fb, aa.bottom, false);
							else if (0 != (Qa & 128))
								aa.bottom = B(fb, aa.bottom, true)
						}
						var Jc = instance.bounds;
						sa = Jc.left;
						oa = Jc.top;
						fa = Jc.right;
						ja = Jc.bottom
					}
					O = 0 != (Pa & 16);
					lg("----order type:" + instance.orderType);
					switch (instance.orderType) {
						// 用点阵图填充制定区域
						case 0 :
							var kb = D, F = instance.destBlt, Ca = ba, Da = O;
							if (0 != (Ca & 1))
								F.x = B(kb, F.x, Da);
							if (0 != (Ca & 2))
								F.y = B(kb, F.y, Da);
							if (0 != (Ca & 4))
								F.cx = B(kb, F.cx, Da);
							if (0 != (Ca & 8))
								F.cy = B(kb, F.cy, Da);
							if (0 != (Ca & 16))
								F.opcode = toShortInt(kb.getByte());
							var lb = F.x, Ra = F.y, Ab = F.cx, J = F.cy, R = F.opcode;
							if (!(lb > instance.width || Ra > instance.height)) {
								var ub = lb + Ab - 1;
								ub > fa && (ub = fa);
								lb < sa && (lb = sa);
								var Ab = ub - lb + 1, bb = Ra + J - 1;
								bb > ja && (bb = ja);
								Ra < oa && (Ra = oa);
								J = bb - Ra + 1;
								1 > Ab
										|| 1 > J
										|| (fillColor(R,
												instance.backImageBuffer,
												instance.width, lb, Ra, Ab, J,
												null, 0, 0, 0), instance.backImageBuffer
												.repaint(lb, Ra, Ab, J))
							}
							break;
						// 用brush填充制定区域
						case 1 :
							var mb = D, ea = instance.patBlt, Sa = ba, Bb = O;
							if (0 != (Sa & 1))
								ea.x = B(mb, ea.x, Bb);
							if (0 != (Sa & 2))
								ea.y = B(mb, ea.y, Bb);
							if (0 != (Sa & 4))
								ea.cx = B(mb, ea.cx, Bb);
							if (0 != (Sa & 8))
								ea.cy = B(mb, ea.cy, Bb);
							if (0 != (Sa & 16)) {
								var $d = ea, ua = mb.getByte();
								$d.opcode = ua & 3 | (ua & 48) >> 2
							}
							if (0 != (Sa & 32))
								ea.backgroundColor = formatColor(mb);
							if (0 != (Sa & 64))
								ea.foregroundColor = formatColor(mb);
							readBrush(mb, ea.brush, Sa >> 7);
							var V = ea.x, Y = ea.y;
							if (!(V > fa || Y > ja)) {
								var Za = ea.opcode, Z = V, w = Y, va = ea.cx, o = ea.cy, Mc = ea.foregroundColor, Ja = ea.backgroundColor, ae = ea.brush.xOrigin, ib = ea.brush.yOrigin, Hb = ea.brush.style, U = ea.brush.pattern, Mc = reformatColor(
										instance, Mc, instance.colorDepth), Ja = reformatColor(
										instance, Ja, instance.colorDepth), Ta = Z
										+ va - 1;
								Ta > fa && (Ta = fa);
								Z < sa && (Z = sa);
								var va = Ta - Z + 1, Ka = w + o - 1;
								Ka > ja && (Ka = ja);
								w < oa && (w = oa);
								o = Ka - w + 1;
								if (!(1 > va || 1 > o)) {
									var nb = null;
									switch (Hb) {
										case 0 :
											for (var nb = Array(va * o), Ua = 0; Ua < nb.length; Ua++)
												nb[Ua] = Mc;
											fillColor(Za,
													instance.backImageBuffer,
													instance.width, Z, w, va,
													o, nb, va, 0, 0);
											instance.backImageBuffer.repaint(Z,
													w, va, o);
											break;
										case 2 :
											System.out.println("hatch");
											break;
										case 3 :
											for (var nb = Array(va * o), Fd = 0, Ua = 0; Ua < o; Ua++)
												for (var M = 0; M < va; M++)
													nb[Fd] = 0 == (U[(Ua + ib)
															% 8] & 1 << (M + ae)
															% 8) ? Mc : Ja, Fd++;
											fillColor(Za,
													instance.backImageBuffer,
													instance.width, Z, w, va,
													o, nb, va, 0, 0);
											instance.backImageBuffer.repaint(Z,
													w, va, o);
											break;
										default :
											console
													.log("Unsupported brush style "
															+ Hb)
									}
								}
							}
							break;
						// The ScreenBlt order contains a bit-block transfer
						// between regions of the screen.
						case 2 :
							var K = D, ka = instance.screenBlt, Vb = ba, hc = O;
							if (0 != (Vb & 1))
								ka.x = B(K, ka.x, hc);
							if (0 != (Vb & 2))
								ka.y = B(K, ka.y, hc);
							if (0 != (Vb & 4))
								ka.cx = B(K, ka.cx, hc);
							if (0 != (Vb & 8))
								ka.cy = B(K, ka.cy, hc);
							if (0 != (Vb & 16))
								ka.opcode = toShortInt(K.getByte());
							if (0 != (Vb & 32))
								ka.srcX = B(K, ka.srcX, hc);
							if (0 != (Vb & 64))
								ka.srcY = B(K, ka.srcY, hc);
							var Cb = ka.x, Db = ka.y;
							if (!(Cb > fa || Db > ja)) {
								var Ib = ka.cx, ic = ka.cy, Oa = ka.opcode, rb = ka.srcX, sb = ka.srcY, Fb = Cb
										+ Ib - 1;
								Fb > fa && (Fb = fa);
								Cb < sa && (Cb = sa);
								var Ib = Fb - Cb + 1, db = Db + ic - 1;
								db > ja && (db = ja);
								Db < oa && (Db = oa);
								ic = db - Db + 1;
								rb += Cb - ka.x;
								sb += Db - ka.y;
								if (Ib > 0 && ic > 0) {
									if (12 != Oa) {
										fillColor(Oa, instance.backImageBuffer,
												Ib, Cb, Db, Ib, ic, null, Ib,
												rb, sb)
									} else {
										instance.backImageBuffer.copyArea(rb,
												sb, Ib, ic, Cb - rb, Db - sb)
									}
									instance.backImageBuffer.repaint(Cb, Db,
											Ib, ic)
								}

							}
							break;
						case 9 :
							var Jb = D, na = instance.line, Kb = ba, jb = O;
							if (0 != (Kb & 1))
								na.mixmode = Jb.getLittleEndian16();
							if (0 != (Kb & 2))
								na.startX = B(Jb, na.startX, jb);
							if (0 != (Kb & 4))
								na.startY = B(Jb, na.startY, jb);
							if (0 != (Kb & 8))
								na.endX = B(Jb, na.endX, jb);
							if (0 != (Kb & 16))
								na.endY = B(Jb, na.endY, jb);
							if (0 != (Kb & 32))
								na.backgroundColor = formatColor(Jb);
							if (0 != (Kb & 64))
								na.opcode = Jb.getByte();
							var Qb = Jb, Xa = na.pen, hb = Kb >> 7;
							if (0 != (hb & 1))
								Xa.style = Qb.getByte();
							if (0 != (hb & 2))
								Xa.width = Qb.getByte();
							if (0 != (hb & 4))
								Xa.color = formatColor(Qb);
							if (1 > na.opcode || 16 < na.opcode)
								lg("invalid ROP2:" + na.opcode);
							else {
								var Lb = na.startX, vb = na.startY, Wb = na.endX, xc = na.endY, rc = na.pen.color, fc = na.opcode
										- 1;
								if (vb == xc) {
									if (Lb > Wb)
										var Sb = Lb, Lb = Wb, Wb = Sb;
									Lb < sa && (Lb = sa);
									Wb > fa && (Wb = fa)
								} else if (Lb = Wb)
									vb > xc && (Sb = vb, vb = xc, xc = Sb), vb < oa
											&& (vb = oa), vb > ja && (vb = ja);
								var Mb = instance.getContext(Lb, vb);
								if (null != Mb) {
									Mb.strokeStyle = createStyleFunction(
											instance, rc), Mb.beginPath(), Mb
											.moveTo(Lb - Mb.offsetX, vb
															- Mb.offsetY), Mb
											.lineTo(Wb - Mb.offsetX, xc
															- Mb.offsetY), Mb
											.stroke(), Mb.beginPath(), Mb
											.closePath()

								}
								drawLine(instance, Lb, vb, Wb, xc, rc, fc);
							}
							break;
						case 10 :
							var Xb = D, Va = instance.rectangle, Yb = ba, Nc = O;
							if (0 != (Yb & 1))
								Va.x = B(Xb, Va.x, Nc);
							if (0 != (Yb & 2))
								Va.y = B(Xb, Va.y, Nc);
							if (0 != (Yb & 4))
								Va.cx = B(Xb, Va.cx, Nc);
							if (0 != (Yb & 8))
								Va.cy = B(Xb, Va.cy, Nc);
							0 != (Yb & 16)
									&& (ob = ob & 4294967040 | Xb.getByte());
							0 != (Yb & 32)
									&& (ob = ob & 4294902015
											| Xb.getByte() << 8);
							0 != (Yb & 64)
									&& (ob = ob & 4278255615
											| Xb.getByte() << 16);
							Va.color = ob;
							fillRectangle(instance, Va.x, Va.y, Va.cx, Va.cy,
									Va.color, true);
							break;
						// 从当前canvas中缓存当前屏幕中的部分图像
						case 11 :
							var jc = D, pb = instance.deskSave, kc = ba, Oc = O;
							if (0 != (kc & 1))
								pb.offset = jc.getLittleEndian32();
							if (0 != (kc & 2))
								pb.left = B(jc, pb.left, Oc);
							if (0 != (kc & 4))
								pb.top = B(jc, pb.top, Oc);
							if (0 != (kc & 8))
								pb.right = B(jc, pb.right, Oc);
							if (0 != (kc & 16))
								pb.bottom = B(jc, pb.bottom, Oc);
							if (0 != (kc & 32))
								pb.action = jc.getByte();
							var qb = pb, gc = qb.right - qb.left + 1, pc = qb.bottom
									- qb.top + 1;
							if (0 == qb.action) {
								if (!(1 > gc || 1 > pc)) {
									var sc = qb.offset + "." + qb.left + "."
											+ qb.top + "." + gc + "." + pc;
									instance.desktopSaveCache[sc] = instance.backImageBuffer
											.getRGBs(qb.left, qb.top, gc, pc)

								}
							} else {
								var sc = qb.offset + "." + qb.left + "."
										+ qb.top + "." + gc + "." + pc
								var tc = instance.desktopSaveCache[sc];
								if ("undefined" != typeof tc) {
									instance.backImageBuffer.setRGBs(qb.left,
											qb.top, gc, pc, tc, 0, gc);
									delete instance.desktopSaveCache[sc]
								}

							}
							break;
						// 图标或图片缓存.
						case 13 :
							var wb = D, ca = instance.memBlt, Eb = ba, lc = O;
							if (0 != (Eb & 1))
								ca.cacheID = wb.getByte(), ca.colorTable = wb
										.getByte();
							if (0 != (Eb & 2))
								ca.x = B(wb, ca.x, lc);
							if (0 != (Eb & 4))
								ca.y = B(wb, ca.y, lc);
							if (0 != (Eb & 8))
								ca.cx = B(wb, ca.cx, lc);
							if (0 != (Eb & 16))
								ca.cy = B(wb, ca.cy, lc);
							if (0 != (Eb & 32))
								ca.opcode = toShortInt(wb.getByte());
							if (0 != (Eb & 64))
								ca.srcX = B(wb, ca.srcX, lc);
							if (0 != (Eb & 128))
								ca.srcY = B(wb, ca.srcY, lc);
							if (0 != (Eb & 256))
								ca.cacheIDX = wb.getLittleEndian16();
							var Fc = ca.x, Gc = ca.y, Hc = ca.cx, Ic = ca.cy, yc = "undefined" == typeof instance.bitmapCache[ca.cacheID]
									|| "undefined" == typeof instance.bitmapCache[ca.cacheID][ca.cacheIDX]
									? null
									: instance.bitmapCache[ca.cacheID][ca.cacheIDX];
							null == yc ? console
									.log("Failed to get bitmap from cache, id:"
											+ ca.cacheID + " idx="
											+ ca.cacheIDX) : paint(instance,
									yc.byteArray, yc.width, yc.height, Fc, Gc,
									Hc, Ic, yc.bytesperpixel);
							break;
						case 14 :
							var Wa = D, pa = instance.triBlt, cb = ba, mc = O;
							if (0 != (cb & 1))
								pa.cacheID = Wa.getByte(), pa.colorTable = Wa
										.getByte();
							if (0 != (cb & 2))
								pa.x = B(Wa, pa.x, mc);
							if (0 != (cb & 4))
								pa.y = B(Wa, pa.y, mc);
							if (0 != (cb & 8))
								pa.cx = B(Wa, pa.cx, mc);
							if (0 != (cb & 16))
								pa.cy = B(Wa, pa.cy, mc);
							if (0 != (cb & 32))
								pa.opcode = toShortInt(Wa.getByte());
							if (0 != (cb & 64))
								pa.srcX = B(Wa, pa.srcX, mc);
							if (0 != (cb & 128))
								pa.srcY = B(Wa, pa.srcY, mc);
							if (0 != (cb & 256))
								pa.backgroundColor = formatColor(Wa);
							if (0 != (cb & 512))
								pa.foregroundColor = formatColor(Wa);
							readBrush(Wa, pa.brush, cb >> 10);
							if (0 != (cb & 32768))
								pa.cacheIDX = Wa.getLittleEndian16();
							if (0 != (cb & 65536))
								pa.unknown = Wa.getLittleEndian16();
							lg("XXX: TriBlt");
							break;
						case 22 :
							var Zb = D, xb = instance.polyLine, nc = ba, vc = O;
							if (0 != (nc & 1))
								xb.x = B(Zb, xb.x, vc);
							if (0 != (nc & 2))
								xb.y = B(Zb, xb.y, vc);
							if (0 != (nc & 4))
								xb.opcode = Zb.getByte();
							if (0 != (nc & 16))
								xb.foregroundColor = formatColor(Zb);
							if (0 != (nc & 32))
								xb.lines = Zb.getByte();
							if (0 != (nc & 64)) {
								var Cc = Zb.getByte();
								xb.dataSize = Cc;
								xb.data = Zb.getBytes(Cc)
							}
							var $b = xb, zc = $b.x, Ac = $b.y, Uc = $b.foregroundColor, Ec = $b.lines, Vc = $b.dataSize, od = $b.data, Qc = Array(1);
							Qc[0] = Math.floor((Ec - 1) / 4) + 1;
							var Nb = 0, Wc = 0, Hd = $b.opcode - 1, startX, startY;
							12 != Hd && lg("TODO: polyline,  opcode=" + Hd);
							var Ob = instance.getContext(zc, Ac);
							if (null != Ob) {
								Ob.strokeStyle = createStyleFunction(instance,
										Uc);
								Ob.beginPath();
								Ob.moveTo(zc - Ob.offsetX, Ac - Ob.offsetY);
								for (var pd = 0; pd < Ec && Qc[0] < Vc; pd++) {
									startX = zc;
									startY = Ac;
									0 == pd % 4 && (Nb = od[Wc++]);
									0 == (Nb & 192) && (Nb |= 192);
									0 != (Nb & 64)
											&& (zc += caculateOffset(od, Qc));
									0 != (Nb & 128)
											&& (Ac += caculateOffset(od, Qc));
									Ob.lineTo(zc - Ob.offsetX, Ac - Ob.offsetY);
									Nb <<= 2;
									drawLine(instance, startX, startY, zc, Ac,
											Uc, Hd);
								}
								Ob.stroke();
								Ob.beginPath();
								Ob.closePath()
							}
							break;
						case 27 :
							var ia = D, P = instance.text2, la = ba;
							if (0 != (la & 1))
								P.font = ia.getByte();
							if (0 != (la & 2))
								P.flags = ia.getByte();
							if (0 != (la & 4))
								P.opcode = ia.getByte();
							if (0 != (la & 8))
								P.mixmode = ia.getByte();
							if (0 != (la & 16))
								P.foregroundColor = formatColor(ia);
							if (0 != (la & 32))
								P.backgroundColor = formatColor(ia);
							if (0 != (la & 64))
								P.clipLeft = ia.getLittleEndian16();
							if (0 != (la & 128))
								P.clipTop = ia.getLittleEndian16();
							if (0 != (la & 256))
								P.clipRight = ia.getLittleEndian16();
							if (0 != (la & 512))
								P.clipBottom = ia.getLittleEndian16();
							if (0 != (la & 1024))
								P.boxLeft = ia.getLittleEndian16();
							if (0 != (la & 2048))
								P.boxTop = ia.getLittleEndian16();
							if (0 != (la & 4096))
								P.boxRight = ia.getLittleEndian16();
							if (0 != (la & 8192))
								P.boxBottom = ia.getLittleEndian16();
							0 != (la & 16384) && ia.skipPosition(1);
							0 != (la & 32768) && ia.skipPosition(1);
							0 != (la & 65536) && ia.skipPosition(1);
							0 != (la & 131072) && ia.skipPosition(1);
							0 != (la & 262144) && ia.skipPosition(7);
							if (0 != (la & 524288))
								P.x = ia.getLittleEndian16();
							if (0 != (la & 1048576))
								P.y = ia.getLittleEndian16();
							if (0 != (la & 2097152))
								P.length = ia.getByte(), P.text = ia
										.getBytes(P.length);
							var Jd = P.font, yb = P.flags, qd = P.mixmode, Kd = P.foregroundColor, Rc = P.backgroundColor, rd = P.clipLeft, sd = P.clipTop, Bc = P.boxLeft, td = P.boxTop, Ea = P.x, gb = P.y, ac = P.length, La = P.text, ud = P.clipRight
									- rd, vd = P.clipBottom - sd, oc = P.boxRight
									- Bc, wd = P.boxBottom - td, Fa = null, Pb = 0, ya = 0;
							Bc + oc > instance.width
									&& (oc = instance.width - Bc);
							1 < oc ? fillRectangle(instance, Bc, td, oc, wd,
									Rc, false) : 1 == qd
									&& fillRectangle(instance, rd, sd, ud, vd,
											Rc, false);
							for (var Xc = La.length, W = 0; W < ac;)
								switch (La[ya + W] & 255) {
									case 255 :
										var xd = La[ya + W + 2] & 255;
										if (xd > Xc - ya) {
											W = ac = 0;
											break
										}
										for (var Ld = Array(La[ya + W + 2]
												& 255), Yc = La, Zc = ya, $c = Ld, onWebSocketOpenFunction = xd, Sc = 0; Sc < onWebSocketOpenFunction; Sc++)
											$c[0 + Sc] = Yc[Zc + Sc];
										var cd = new textCacheItem(xd, Ld), Md = La[ya
												+ W + 1]
												& 255;
										if (Md < instance.textCache.length)
											instance.textCache[Md] = cd;
										else
											throw "Could not put Text in cache";
										W += 3;
										ac -= W;
										ya = W;
										W = 0;
										break;
									case 254 :
										var bc;
										b : {
											var Nd = La[ya + W + 1] & 255, Tc = null;
											if (Nd < instance.textCache.length
													&& (Tc = instance.textCache[Nd], null != Tc
															&& null != Tc.data)) {
												bc = Tc;
												break b
											}
											bc = null
										}
										var cc = null != bc ? bc.data : null;
										null != bc
												&& 0 == cc[1]
												&& 0 == (yb & 32)
												&& (0 != (yb & 4) ? gb += La[ya
														+ W + 2]
														& 255 : Ea += La[ya + W
														+ 2]
														& 255);
										W = W + 2 < ac ? W + 3 : W + 2;
										ac -= W;
										ya = W;
										W = 0;
										if (null == bc)
											break;
										for (var dd = bc.size, zb = 0; zb < dd; zb++)
											Fa = getFontFromCache(instance, Jd,
													cc[zb] & 255), 0 == (yb & 32)
													&& (Pb = cc[++zb] & 255, 0 != (Pb & 128)
															? (0 != (yb & 4)
																	? gb += cc[zb
																			+ 1]
																			& 255
																			| (cc[zb
																					+ 2] & 255) << 8
																	: Ea += cc[zb
																			+ 1]
																			& 255
																			| (cc[zb
																					+ 2] & 255) << 8, zb += 2)
															: 0 != (yb & 4)
																	? gb += Pb
																	: Ea += Pb), null != Fa
													&& (printText(instance, qd,
															Ea + Fa.offset
																	& 65535,
															gb + Fa.baseLine
																	& 65535,
															Fa.width,
															Fa.height,
															Fa.fontData, Rc,
															Kd,
															instance.fontColor,
															instance.colorDepth), 0 != (yb & 32)
															&& (Ea += Fa.width));
										break;
									default :
										Fa = getFontFromCache(instance, Jd,
												La[ya + W] & 255), 0 == (yb & 32)
												&& (Pb = La[ya + ++W] & 255, 0 != (Pb & 128)
														? (0 != (yb & 4)
																? gb += La[ya
																		+ W + 1]
																		& 255
																		| (La[ya
																				+ W
																				+ 2] & 255) << 8
																: Ea += La[ya
																		+ W + 1]
																		& 255
																		| (La[ya
																				+ W
																				+ 2] & 255) << 8, W += 2)
														: 0 != (yb & 4)
																? gb += Pb
																: Ea += Pb), null != Fa
												&& (printText(instance, qd, Ea
																+ Fa.offset
																& 65535, gb
																+ Fa.baseLine
																& 65535,
														Fa.width, Fa.height,
														Fa.fontData, Rc, Kd,
														instance.fontColor,
														instance.colorDepth), 0 != (yb & 32)
														&& (Ea += Fa.width)), W++
								}
							1 < oc ? 0 < wd
									&& instance.backImageBuffer.repaint(Bc, td,
											oc, wd) : 0 < ud
									&& 0 < vd
									&& instance.backImageBuffer.repaint(rd, sd,
											ud, vd);
							break;
						default :
							lg("XXX Order type " + instance.orderType);
							break a
					}
					0 != (Pa & 4) && resetBorder(instance)
				}
			d++
		}
	}

	function drawLine(instance, startX, startY, endX, endY, color, opcode) {
		var z = instance.backImageBuffer;
		if (startX == endX || startY == endY) {
			var k, l;
			if (startY == endY) {
				if (startY >= oa && startY <= ja)
					if (endX > startX) {
						startX < sa && (startX = sa);
						endX > fa && (endX = fa);
						k = startY * instance.width + startX;
						for (l = 0; l < endX - startX; l++)
							setPoint(opcode, z, startX + l, startY, color), k++;
					} else {
						endX < sa && (endX = sa);
						startX > fa && (startX = fa);
						k = startY * instance.width + startX;
						for (l = 0; l < startX - endX; l++)
							setPoint(opcode, z, endX + l, startY, color), k--;
					}
			} else if (startX >= sa && startX <= fa)
				if (endY > startY) {
					startY < oa && (startY = oa);
					endY > ja && (endY = ja);
					k = startY * instance.width + startX;
					for (l = 0; l < endY - startY; l++)
						setPoint(opcode, z, startX, startY + l, color), k += instance.width;
				} else {
					endY < oa && (endY = oa);
					startY > ja && (startY = ja);
					k = startY * instance.width + startX;
					for (l = 0; l < startY - endY; l++)
						setPoint(opcode, z, startX, endY + l, color), k -= instance.width;
				}
		} else {
			var h = Math.abs(endX - startX), f = Math.abs(endY - startY);
			k = startX;
			l = startY;
			var g, i, n, o, s, r, x;
			i = endX >= startX ? g = 1 : g = -1;
			o = endY >= startY ? n = 1 : n = -1;
			h >= f
					? (o = g = 0, r = h, s = h / 2, x = f)
					: (n = i = 0, r = f, s = f / 2, x = h, h = f);
			for (f = 0; f <= h; f++)
				k < sa || k > fa || l < oa || l > ja
						|| setPoint(opcode, z, k, l, color), s += x, s >= r
						&& (s -= r, k += g, l += n), k += i, l += o;
		}
	}

	function decompressColor(a) {
		return 4278190080 | (a >> 8 & 248 | a >> 13 & 7) << 16
				| (a >> 3 & 252 | a >> 9 & 3) << 8 | a << 3 & 248 | a >> 2 & 7
	}

	function setPoint(opcode, image, x, y, color) {
		if (null != image) {
			var e = image.getRGB(x, y);
			switch (opcode) {
				case 0 :
					image.setRGB(x, y, 0);
					break;
				case 1 :
					image.setRGB(x, y, ~(e | color) & 16777215);
					break;
				case 2 :
					image.setRGB(x, y, e & ~color & 16777215);
					break;
				case 3 :
					image.setRGB(x, y, ~color & 16777215);
					break;
				case 4 :
					image.setRGB(x, y, (~e & color) * 16777215);
					break;
				case 5 :
					image.setRGB(x, y, ~e & 16777215);
					break;
				case 6 :
					image.setRGB(x, y, e ^ color & 16777215);
					break;
				case 7 :
					image.setRGB(x, y, ~e & color & 16777215);
					break;
				case 8 :
					image.setRGB(x, y, e & color & 16777215);
					break;
				case 9 :
					image.setRGB(x, y, e ^ ~color & 16777215);
					break;
				case 10 :
					break;
				case 11 :
					image.setRGB(x, y, e | ~color & 16777215);
					break;
				case 12 :
					image.setRGB(x, y, color);
					break;
				case 13 :
					image.setRGB(x, y, (~e | color) & 16777215);
					break;
				case 14 :
					image.setRGB(x, y, e | color & 16777215);
					break;
				case 15 :
					image.setRGB(x, y, 16777215);
					break;
				default :
					lg("unsupported pixel opcode: " + opcode)
			}
		}
	}

	function decodePackageFunction(a) {
		a = lib.rdp.Base64.dec(a, 0);
		return new lib.rdp.DataPackage(a, 0, a.length)
	}

	function B(a, b, d) {
		var c = 0;
		d ? (c = a.getByte(), 127 < c && (c -= 256), b += c) : b = a
				.getLittleEndian16();
		return b
	}
	function toShortInt(a) {
		return a & 15
	}
	function formatColor(a) {
		var b = 0, d = 0, b = d = a.getByte(), d = a.getByte(), b = b | d << 8, d = a
				.getByte();
		return b | d << 16
	}
	function readBrush(a, b, d) {
		if (0 != (d & 1))
			b.xOrigin = a.getByte();
		if (0 != (d & 2))
			b.yOrigin = a.getByte();
		if (0 != (d & 4))
			b.style = a.getByte();
		var c = b.pattern;
		0 != (d & 8) && (c[0] = a.getByte());
		if (0 != (d & 16))
			for (d = 1; 8 > d; d++)
				c[d] = a.getByte();
		b.pattern = c
	}
	function processBitmapUpdates(instance, a) {
		var b = 0, d = 0, c = 0, i = 0, e = 0, t = 0, k = 0, l = 0, g = 0, h = 0, m = 0, f = 0, i = 0, n, x, u, q;
		u = q = 0;
		n = instance.width;
		x = instance.height;
		for (var b = a.getLittleEndian16(), B = 0; B < b; B++) {
			var d = a.getLittleEndian16(), c = a.getLittleEndian16(), i = a
					.getLittleEndian16(), e = a.getLittleEndian16(), t = a
					.getLittleEndian16(), k = a.getLittleEndian16(), h = a
					.getLittleEndian16(), CC = Math.floor((h + 7) / 8), m = a
					.getLittleEndian16(), f = a.getLittleEndian16(), l = i - d
					+ 1, g = e - c + 1;
			n > d && (n = d);
			x > c && (x = c);
			u < i && (u = i);
			q < e && (q = e);
			instance.colorDepth != h
					&& (lg("Server limited colour depth to " + h + " bits"), instance.colorDepth = h, instance.fontColor = Math
							.floor((instance.colorDepth + 7) / 8));
			if (0 == m) {
				i = t * CC;
				e = k * i;
				h = Array(e);
				m = a.getPosition();
				for (f = 0; f < k; f++) {
					for (var G = a.getData(), H = m, v = h, ed = (k - f - 1)
							* i, E = i, N = 0; N < E; N++)
						v[ed + N] = G[H + N];
					m += i
				}
				a.skipPosition(e);
				displayImage(instance, h, d, c, t, k, l, g, CC)
			} else
				0 != (m & 1024) ? i = f : (a.skipPosition(2), i = a
						.getLittleEndian16(), a.skipPosition(4)), paint(
						instance, a.getBytes(i), t, k, d, c, l, g, CC)
		}
	}
	function resetBorder(instance) {
		sa = 0;
		fa = instance.width - 1;
		oa = 0;
		ja = instance.height - 1
	}
	function printText(instance, a, b, d, c, i, e, t, k, l) {
		var g = 0, h = 128, g = Math.floor((c - 1) / 8) + 1, m, k = reformatColor(
				instance, k, instance.colorDepth), t = reformatColor(instance,
				t, instance.colorDepth);
		3 == l
				&& (k = (k & 255) << 16 | k & 65280 | (k & 16711680) >> 16, t = (t & 255) << 16
						| t & 65280 | (t & 16711680) >> 16);
		if (!(b > fa || d > ja))
			if (l = b + c - 1, l > fa && (l = fa), c = b < sa ? sa : b, l = l
					- b + 1, m = d + i - 1, m > ja && (m = ja), i = d < oa
					? oa
					: d, m = m - i + 1, !(1 > l || 1 > m))
				if (g *= i - d, 0 == a)
					for (a = 0; a < m; a++) {
						for (var f = 0; f < l; f++)
							0 == h && (g++, h = 128), 0 != (e[g] & h)
									&& b + f >= c
									&& 0 < c + f
									&& 0 < i + a
									&& instance.backImageBuffer.setRGB(c + f, i
													+ a, k), h >>= 1;
						g++;
						h = 128;
						g == e.length && (g = 0)
					}
				else
					for (a = 0; a < m; a++) {
						for (f = 0; f < l; f++)
							0 == h && (g++, h = 128), b + f >= c
									&& 0 < b + f
									&& 0 < d + a
									&& (0 != (e[g] & h)
											? instance.backImageBuffer.setRGB(b
															+ f, d + a, k)
											: instance.backImageBuffer.setRGB(b
															+ f, d + a, t)), h >>= 1;
						g++;
						h = 128;
						g == e.length && (g = 0)
					}
	}
	function reformatColor(instance, a, b) {
		var d;
		switch (b) {
			case 16 :
				return -16777216 | (a >> 8 & 248 | a >> 13 & 7) << 16
						| (a >> 3 & 252 | a >> 9 & 3) << 8 | a << 3 & 248
						| a >> 2 & 7;
			case 15 :
				return -16777216 | (a >> 7 & 248 | a >> 12 & 7) << 16
						| (a >> 2 & 248 | a >> 8 & 7) << 8 | a << 3 & 248
						| a >> 2 & 7;
			case 8 :
				return -16777216 | instance.defaultPalett[0][a] << 16
						| instance.defaultPalett[1][a] << 8
						| instance.defaultPalett[2][a];
			case 32 :
				return a;
			case 24 :
				return -16777216 | a
		}
		lg("XXXX no here")
	}
	function caculateOffset(a, b) {
		var d = a[b[0]++] & 255, c = d & 128, d = 0 != (d & 64) ? d | -64 : d
				& 63;
		0 != c && (d = d << 8 | a[b[0]++] & 255);
		return d
	}
	function createStyleFunction(instance, a) {
		var b = Array(4);
		adjustColorDepth(instance, a, instance.colorDepth, b, 0);
		return "rgb(" + b[0] + "," + b[1] + "," + b[2] + ")"
	}
	function fillRectangle(instance, a, b, d, c, i, e) {
		if (!(a > fa || b > ja))
			if (d = a + d - 1, d > fa && (d = fa), a < sa && (a = sa), d = d
					- a + 1, c = b + c - 1, c > ja && (c = ja), b < oa
					&& (b = oa), c = c - b + 1, !(1 > d || 1 > c))
				if (instance.backImageBuffer.fillRect(a, b, d, c,
						reformatColor(instance, i, instance.colorDepth)), e
						&& (e = instance.getContext(a, b), null != e))
					e.fillStyle = createStyleFunction(instance, i), e.fillRect(
							a - e.offsetX, b - e.offsetY, d, c)
	}
	function displayImage(instance, a, b, d, c, i, e, t, k) {
		i = instance.getContext(b, d);
		if (null != i) {
			var l = i.createImageData(e, t), g = instance.colorDepth, h = l.data, t = e
					* t;
			if (2 == k) {
				a = new wrappedImage(a, 2 * e, 2 * c);
				for (c = 0; c < t; c++)
					e = a.next() & 255 | (a.next() & 255) << 8, k = 4 * c, adjustColorDepth(
							instance, e, g, h, k)
			} else if (1 == k) {
				a = new wrappedImage(a, e, c);
				for (c = 0; c < t; c++)
					e = a.next() & 255, k = 4 * c, adjustColorDepth(instance,
							e, g, h, k)
			} else {
				a = new wrappedImage(a, 3 * e, 3 * c);
				for (c = 0; c < t; c++)
					e = a.next() & 255 | (a.next() & 255) << 8
							| (a.next() & 255) << 16, k = 4 * c, adjustColorDepth(
							instance, e, g, h, k)
			}
			i.putImageData(l, b - i.offsetX, d - i.offsetY)
		}
	}
	function paint(instance, a, b, d, c, i, e, t, k) {
		if (1 == k) {
			for (var l = d, g = a.length, h = -1, f = 0, j = 0, n = 0, x = 0, u = 0, q = b, B = -1, y = 0, C = 0, G = 0, H = 0, v = 0, E = 0, N = 4294967295, ha = false, fa = false, ja = false, L = Array(b
					* l); j < g;) {
				y = 0;
				C = a[j++] & 255;
				n = C >> 4;
				switch (n) {
					case 12 :
					case 13 :
					case 14 :
						n -= 6;
						x = C & 15;
						u = 16;
						break;
					case 15 :
						n = C & 15;
						9 > n
								? (x = a[j++] & 255, x |= (a[j++] & 255) << 8)
								: x = 11 > n ? 8 : 1;
						u = 0;
						break;
					default :
						n >>= 1, x = C & 31, u = 32
				}
				0 != u
						&& (ja = 2 == n || 7 == n, 0 == x ? x = ja
								? (a[j++] & 255) + 1
								: (a[j++] & 255) + u : ja && (x <<= 3));
				switch (n) {
					case 0 :
						B == n && !(q == b && -1 == h) && (ha = true);
						break;
					case 8 :
						G = a[j++] & 255;
					case 3 :
						H = a[j++] & 255;
						break;
					case 6 :
					case 7 :
						N = a[j++];
						n -= 5;
						break;
					case 9 :
						E = 3;
						n = 2;
						y = 3;
						break;
					case 10 :
						E = 5, n = 2, y = 5
				}
				B = n;
				for (v = 0; 0 < x;) {
					if (q >= b) {
						if (0 >= l)
							throw "Decompressing bitmap failed! Height = " + l;
						q = 0;
						l--;
						h = f;
						f = 0 + l * b
					}
					switch (n) {
						case 0 :
							ha
									&& (L[f + q] = -1 == h
											? N & 255
											: (L[h + q] ^ N & 255) & 255, ha = false, x--, q++);
							if (-1 == h) {
								for (; 0 != (x & -8) && q + 8 < b;)
									for (var Q = 0; 8 > Q; Q++)
										L[f + q] = 0, x--, q++;
								for (; 0 < x && q < b;)
									L[f + q] = 0, x--, q++
							} else {
								for (; 0 != (x & -8) && q + 8 < b;)
									for (Q = 0; 8 > Q; Q++)
										L[f + q] = L[h + q], x--, q++;
								for (; 0 < x && q < b;)
									L[f + q] = L[h + q], x--, q++
							}
							break;
						case 1 :
							if (-1 == h) {
								for (; 0 != (x & -8) && q + 8 < b;)
									for (Q = 0; 8 > Q; Q++)
										L[f + q] = N & 255, x--, q++;
								for (; 0 < x && q < b;)
									L[f + q] = N & 255, x--, q++
							} else {
								for (; 0 != (x & -8) && q + 8 < b;)
									for (Q = 0; 8 > Q; Q++) {
										var qa = fetchEvenColor(L, h, q) ^ N;
										L[f + q] = qa & 255;
										x--;
										q++
									}
								for (; 0 < x && q < b;) {
									var wa = fetchEvenColor(L, h, q) ^ N;
									L[f + q] = wa & 255;
									x--;
									q++
								}
							}
							break;
						case 2 :
							if (-1 == h) {
								for (; 0 != (x & -8) && q + 8 < b;)
									for (Q = 0; 8 > Q; Q++)
										v <<= 1, v &= 255, 0 == v
												&& (E = 0 != y
														? y & 255
														: a[j++], v = 1), L[f
												+ q] = 0 != (E & v)
												? N & 255
												: 0, x--, q++;
								for (; 0 < x && q < b;)
									v <<= 1, v &= 255, 0 == v
											&& (E = 0 != y ? y & 255 : a[j++], v = 1), L[f
											+ q] = 0 != (E & v) ? N & 255 : 0, x--, q++
							} else {
								for (; 0 != (x & -8) && q + 8 < b;)
									for (Q = 0; 8 > Q; Q++)
										v <<= 1, v &= 255, 0 == v
												&& (E = 0 != y
														? y & 255
														: a[j++], v = 1), L[f
												+ q] = 0 != (E & v)
												? (L[h + q] ^ N & 255) & 255
												: L[h + q], x--, q++;
								for (; 0 < x && q < b;)
									v <<= 1, v &= 255, 0 == v
											&& (E = 0 != y ? y & 255 : a[j++], v = 1), L[f
											+ q] = 0 != (E & v) ? (L[h + q] ^ N
											& 255)
											& 255 : L[h + q], x--, q++
							}
							break;
						case 3 :
							for (; 0 != (x & -8) && q + 8 < b;)
								for (Q = 0; 8 > Q; Q++)
									L[f + q] = H & 255, x--, q++;
							for (; 0 < x && q < b;)
								L[f + q] = H & 255, x--, q++;
							break;
						case 4 :
							for (; 0 != (x & -8) && q + 8 < b;)
								for (Q = 0; 8 > Q; Q++)
									L[f + q] = a[j++], x--, q++;
							for (; 0 < x && q < b;)
								L[f + q] = a[j++], x--, q++;
							break;
						case 8 :
							for (; 0 != (x & -8) && q + 8 < b;)
								for (Q = 0; 8 > Q; Q++)
									fa
											? (L[f + q] = H & 255, fa = false)
											: (L[f + q] = G & 255, fa = true, x++), x--, q++;
							for (; 0 < x && q < b;)
								fa ? (L[f + q] = H & 255, fa = false) : (L[f
										+ q] = G & 255, fa = true, x++), x--, q++;
							break;
						case 13 :
							for (; 0 != (x & -8) && q + 8 < b;)
								for (Q = 0; 8 > Q; Q++)
									L[f + q] = 255, x--, q++;
							for (; 0 < x && q < b;)
								L[f + q] = 255, x--, q++;
							break;
						case 14 :
							for (; 0 != (x & -8) && q + 8 < b;)
								for (Q = 0; 8 > Q; Q++)
									L[f + q] = 0, x--, q++;
							for (; 0 < x && q < b;)
								L[f + q] = 0, x--, q++;
							break;
						default :
							throw "Unimplemented decompress opcode " + n;
					}
				}
			}
			displayImage(instance, L, c, i, b, d, e, t, k)
		} else {
			var ma;
			a : {
				var sa = a.length;
				switch (instance.colorDepth) {
					case 16 :
						for (var oa = d, xa = -1, X = 0, $ = 0, Ga = $ + sa, ga = 0, z = 0, ra = 0, s = b, Na = -1, $a = 0, za = 0, Ma = 0, Ba = 0, S = 0, ab = 0, Ha = 4294967295, Ya = false, Qe = false, Za = false, I = Array(b
								* oa); $ < Ga;) {
							$a = 0;
							za = a[$++] & 255;
							ga = za >> 4;
							switch (ga) {
								case 12 :
								case 13 :
								case 14 :
									ga -= 6;
									z = za & 15;
									ra = 16;
									break;
								case 15 :
									ga = za & 15;
									9 > ga
											? (z = a[$++] & 255, z |= (a[$++] & 255) << 8)
											: z = 11 > ga ? 8 : 1;
									ra = 0;
									break;
								default :
									ga >>= 1, z = za & 31, ra = 32
							}
							0 != ra
									&& (Za = 2 == ga || 7 == ga, 0 == z
											? z = Za
													? (a[$++] & 255) + 1
													: (a[$++] & 255) + ra
											: Za && (z <<= 3));
							switch (ga) {
								case 0 :
									Na == ga && !(s == b && -1 == xa)
											&& (Ya = true);
									break;
								case 8 :
									Ma = fetchDotColor(a, $), $ += k;
								case 3 :
									Ba = fetchDotColor(a, $);
									$ += k;
									break;
								case 6 :
								case 7 :
									Ha = fetchDotColor(a, $);
									$ += k;
									ga -= 5;
									break;
								case 9 :
									ab = 3;
									ga = 2;
									$a = 3;
									break;
								case 10 :
									ab = 5, ga = 2, $a = 5
							}
							Na = ga;
							for (S = 0; 0 < z;) {
								if (s >= b) {
									if (0 >= oa)
										throw "Decompressing bitmap failed! Height = "
												+ oa;
									s = 0;
									oa--;
									xa = X;
									X = 0 + oa * b
								}
								switch (ga) {
									case 0 :
										Ya
												&& (I[X + s] = -1 == xa
														? Ha
														: I[xa + s] ^ Ha, Ya = false, z--, s++);
										if (-1 == xa) {
											for (; 0 != (z & -8) && s + 8 < b;)
												for (var D = 0; 8 > D; D++)
													I[X + s] = 0, z--, s++;
											for (; 0 < z && s < b;)
												I[X + s] = 0, z--, s++
										} else {
											for (; 0 != (z & -8) && s + 8 < b;)
												for (D = 0; 8 > D; D++)
													I[X + s] = I[xa + s], z--, s++;
											for (; 0 < z && s < b;)
												I[X + s] = I[xa + s], z--, s++
										}
										break;
									case 1 :
										if (-1 == xa) {
											for (; 0 != (z & -8) && s + 8 < b;)
												for (D = 0; 8 > D; D++)
													I[X + s] = Ha, z--, s++;
											for (; 0 < z && s < b;)
												I[X + s] = Ha, z--, s++
										} else {
											for (; 0 != (z & -8) && s + 8 < b;)
												for (D = 0; 8 > D; D++)
													I[X + s] = I[xa + s] ^ Ha, z--, s++;
											for (; 0 < z && s < b;)
												I[X + s] = I[xa + s] ^ Ha, z--, s++
										}
										break;
									case 2 :
										if (-1 == xa) {
											for (; 0 != (z & -8) && s + 8 < b;)
												for (D = 0; 8 > D; D++)
													S <<= 1, S &= 255, 0 == S
															&& (ab = 0 != $a
																	? $a & 255
																	: a[$++]
																			& 255, S = 1), I[X
															+ s] = 0 != (ab & S)
															? Ha
															: 0, z--, s++;
											for (; 0 < z && s < b;)
												S <<= 1, S &= 255, 0 == S
														&& (ab = 0 != $a ? $a
																& 255 : a[$++]
																& 255, S = 1), I[X
														+ s] = 0 != (ab & S)
														? Ha
														: 0, z--, s++
										} else {
											for (; 0 != (z & -8) && s + 8 < b;)
												for (D = 0; 8 > D; D++)
													S <<= 1, S &= 255, 0 == S
															&& (ab = 0 != $a
																	? $a & 255
																	: a[$++]
																			& 255, S = 1), I[X
															+ s] = 0 != (ab & S)
															? I[xa + s] ^ Ha
															: I[xa + s], z--, s++;
											for (; 0 < z && s < b;)
												S <<= 1, S &= 255, 0 == S
														&& (ab = 0 != $a ? $a
																& 255 : a[$++]
																& 255, S = 1), I[X
														+ s] = 0 != (ab & S)
														? I[xa + s] ^ Ha
														: I[xa + s], z--, s++
										}
										break;
									case 3 :
										for (; 0 != (z & -8) && s + 8 < b;)
											for (D = 0; 8 > D; D++)
												I[X + s] = Ba, z--, s++;
										for (; 0 < z && s < b;)
											I[X + s] = Ba, z--, s++;
										break;
									case 4 :
										for (; 0 != (z & -8) && s + 8 < b;)
											for (D = 0; 8 > D; D++)
												I[X + s] = fetchDotColor(a, $), $ += k, z--, s++;
										for (; 0 < z && s < b;)
											I[X + s] = fetchDotColor(a, $), $ += k, z--, s++;
										break;
									case 8 :
										for (; 0 != (z & -8) && s + 8 < b;)
											for (D = 0; 8 > D; D++)
												Qe
														? (I[X + s] = Ba, Qe = false)
														: (I[X + s] = Ma, Qe = true, z++), z--, s++;
										for (; 0 < z && s < b;)
											Qe
													? (I[X + s] = Ba, Qe = false)
													: (I[X + s] = Ma, Qe = true, z++), z--, s++;
										break;
									case 13 :
										for (; 0 != (z & -8) && s + 8 < b;)
											for (D = 0; 8 > D; D++)
												I[X + s] = 16777215, z--, s++;
										for (; 0 < z && s < b;)
											I[X + s] = 16777215, z--, s++;
										break;
									case 14 :
										for (; 0 != (z & -8) && s + 8 < b;)
											for (D = 0; 8 > D; D++)
												I[X + s] = 0, z--, s++;
										for (; 0 < z && s < b;)
											I[X + s] = 0, z--, s++;
										break;
									default :
										throw "Unimplemented decompress opcode "
												+ ga;
								}
							}
						}
						ma = I;
						break a;
					case 15 :
						for (var Pa = d, ba = -1, T = 0, O = 0, jb = O + sa, da = 0, A = 0, Ia = 0, r = b, fb = -1, aa = 0, Qa = 0, db = 0, kb = 0, F = 0, Ca = 0, Da = 4294967295, lb = false, Ra = false, Ab = false, J = Array(b
								* Pa); O < jb;) {
							aa = 0;
							Qa = a[O++] & 255;
							da = Qa >> 4;
							switch (da) {
								case 12 :
								case 13 :
								case 14 :
									da -= 6;
									A = Qa & 15;
									Ia = 16;
									break;
								case 15 :
									da = Qa & 15;
									9 > da
											? (A = a[O++] & 255, A |= (a[O++] & 255) << 8)
											: A = 11 > da ? 8 : 1;
									Ia = 0;
									break;
								default :
									da >>= 1, A = Qa & 31, Ia = 32
							}
							0 != Ia
									&& (Ab = 2 == da || 7 == da, 0 == A
											? A = Ab
													? (a[O++] & 255) + 1
													: (a[O++] & 255) + Ia
											: Ab && (A <<= 3));
							switch (da) {
								case 0 :
									fb == da && !(r == b && -1 == ba)
											&& (lb = true);
									break;
								case 8 :
									db = fetchOddColor(a, O), O += 2;
								case 3 :
									kb = fetchOddColor(a, O);
									O += 2;
									break;
								case 6 :
								case 7 :
									Da = fetchOddColor(a, O);
									O += 2;
									da -= 5;
									break;
								case 9 :
									Ca = 3;
									da = 2;
									aa = 3;
									break;
								case 10 :
									Ca = 5, da = 2, aa = 5
							}
							fb = da;
							for (F = 0; 0 < A;) {
								if (r >= b) {
									if (0 >= Pa)
										throw "Decompressing bitmap failed! Height = "
												+ Pa;
									r = 0;
									Pa--;
									ba = T;
									T = 0 + Pa * b
								}
								switch (da) {
									case 0 :
										lb
												&& (J[T + r] = -1 == ba
														? Da
														: J[ba + r] ^ Da, lb = false, A--, r++);
										if (-1 == ba) {
											for (; 0 != (A & -8) && r + 8 < b;)
												for (var R = 0; 8 > R; R++)
													J[T + r] = 0, A--, r++;
											for (; 0 < A && r < b;)
												J[T + r] = 0, A--, r++
										} else {
											for (; 0 != (A & -8) && r + 8 < b;)
												for (R = 0; 8 > R; R++)
													J[T + r] = J[ba + r], A--, r++;
											for (; 0 < A && r < b;)
												J[T + r] = J[ba + r], A--, r++
										}
										break;
									case 1 :
										if (-1 == ba) {
											for (; 0 != (A & -8) && r + 8 < b;)
												for (R = 0; 8 > R; R++)
													J[T + r] = Da, A--, r++;
											for (; 0 < A && r < b;)
												J[T + r] = Da, A--, r++
										} else {
											for (; 0 != (A & -8) && r + 8 < b;)
												for (R = 0; 8 > R; R++)
													J[T + r] = J[ba + r] ^ Da, A--, r++;
											for (; 0 < A && r < b;)
												J[T + r] = J[ba + r] ^ Da, A--, r++
										}
										break;
									case 2 :
										if (-1 == ba) {
											for (; 0 != (A & -8) && r + 8 < b;)
												for (R = 0; 8 > R; R++)
													F <<= 1, F &= 255, 0 == F
															&& (Ca = 0 != aa
																	? aa & 255
																	: a[O++], F = 1), J[T
															+ r] = 0 != (Ca & F)
															? Da & 255
															: 0, A--, r++;
											for (; 0 < A && r < b;)
												F <<= 1, F &= 255, 0 == F
														&& (Ca = 0 != aa ? aa
																& 255 : a[O++], F = 1), J[T
														+ r] = 0 != (Ca & F)
														? Da
														: 0, A--, r++
										} else {
											for (; 0 != (A & -8) && r + 8 < b;)
												for (R = 0; 8 > R; R++)
													F <<= 1, F &= 255, 0 == F
															&& (Ca = 0 != aa
																	? aa & 255
																	: a[O++], F = 1), J[T
															+ r] = 0 != (Ca & F)
															? J[ba + r] ^ Da
															: J[ba + r], A--, r++;
											for (; 0 < A && r < b;)
												F <<= 1, F &= 255, 0 == F
														&& (Ca = 0 != aa ? aa
																& 255 : a[O++], F = 1), J[T
														+ r] = 0 != (Ca & F)
														? J[ba + r] ^ Da
														: J[ba + r], A--, r++
										}
										break;
									case 3 :
										for (; 0 != (A & -8) && r + 8 < b;)
											for (R = 0; 8 > R; R++)
												J[T + r] = kb, A--, r++;
										for (; 0 < A && r < b;)
											J[T + r] = kb, A--, r++;
										break;
									case 4 :
										for (; 0 != (A & -8) && r + 8 < b;)
											for (R = 0; 8 > R; R++)
												J[T + r] = fetchOddColor(a, O), O += 2, A--, r++;
										for (; 0 < A && r < b;)
											J[T + r] = fetchOddColor(a, O), O += 2, A--, r++;
										break;
									case 8 :
										for (; 0 != (A & -8) && r + 8 < b;)
											for (R = 0; 8 > R; R++)
												Ra
														? (J[T + r] = kb, Ra = false)
														: (J[T + r] = db, Ra = true, A++), A--, r++;
										for (; 0 < A && r < b;)
											Ra
													? (J[T + r] = kb, Ra = false)
													: (J[T + r] = db, Ra = true, A++), A--, r++;
										break;
									case 13 :
										for (; 0 != (A & -8) && r + 8 < b;)
											for (R = 0; 8 > R; R++)
												J[T + r] = 16777215, A--, r++;
										for (; 0 < A && r < b;)
											J[T + r] = 16777215, A--, r++;
										break;
									case 14 :
										for (; 0 != (A & -8) && r + 8 < b;)
											for (R = 0; 8 > R; R++)
												J[T + r] = 0, A--, r++;
										for (; 0 < A && r < b;)
											J[T + r] = 0, A--, r++;
										break;
									default :
										throw "Unimplemented decompress opcode "
												+ da;
								}
							}
						}
						ma = J;
						break a;
					case 32 :
						var ub;
						if (16 != a[0])
							throw new "Wrong tag.";
						var input = 1;
						var bb = Array(4 * b * d);
						ub = Qb(a, input, b, d, bb, 3);
						input += ub;
						ub = Qb(a, input, b, d, bb, 2);
						input += ub;
						ub = Qb(a, input, b, d, bb, 1);
						input += ub;
						Qb(a, input, b, d, bb, 0);
						for (var mb = Math.floor(bb.length / 4), ea = Array(mb), Sa = 0, Bb = 0; Bb < mb; Bb++)
							Sa = Bb << 2, ea[Bb] = (bb[Sa + 3] & 255) << 24
									| (bb[Sa + 2] & 255) << 16
									| (bb[Sa + 1] & 255) << 8
									| (bb[Sa + 0] & 255) << 0;
						ma = ea;
						break a;
					default :
						for (var Oa = d, ua = -1, V = 0, Y = 0, tb = Y + sa, Z = 0, w = 0, va = 0, o = b, ob = -1, Ja = 0, Xa = 0, hb = 0, Hb = 0, U = 0, Ta = 0, Ka = 4294967295, nb = false, Ua = false, ib = false, M = Array(b
								* Oa); Y < tb;) {
							Ja = 0;
							Xa = a[Y++] & 255;
							Z = Xa >> 4;
							switch (Z) {
								case 12 :
								case 13 :
								case 14 :
									Z -= 6;
									w = Xa & 15;
									va = 16;
									break;
								case 15 :
									Z = Xa & 15;
									9 > Z
											? (w = a[Y++] & 255, w |= (a[Y++] & 255) << 8)
											: w = 11 > Z ? 8 : 1;
									va = 0;
									break;
								default :
									Z >>= 1, w = Xa & 31, va = 32
							}
							0 != va
									&& (ib = 2 == Z || 7 == Z, 0 == w ? w = ib
											? (a[Y++] & 255) + 1
											: (a[Y++] & 255) + va : ib
											&& (w <<= 3));
							switch (Z) {
								case 0 :
									ob == Z && !(o == b && -1 == ua)
											&& (nb = true);
									break;
								case 8 :
									hb = fetchMicColor(a, Y, k), Y += k;
								case 3 :
									Hb = fetchMicColor(a, Y, k);
									Y += k;
									break;
								case 6 :
								case 7 :
									Ka = fetchMicColor(a, Y, k);
									Y += k;
									Z -= 5;
									break;
								case 9 :
									Ta = 3;
									Z = 2;
									Ja = 3;
									break;
								case 10 :
									Ta = 5, Z = 2, Ja = 5
							}
							ob = Z;
							for (U = 0; 0 < w;) {
								if (o >= b) {
									if (0 >= Oa)
										throw "Decompressing bitmap failed! Height = "
												+ Oa;
									o = 0;
									Oa--;
									ua = V;
									V = 0 + Oa * b
								}
								switch (Z) {
									case 0 :
										nb
												&& (M[V + o] = -1 == ua
														? Ka
														: M[ua + o] ^ Ka, nb = false, w--, o++);
										if (-1 == ua) {
											for (; 0 != (w & -8) && o + 8 < b;)
												for (var K = 0; 8 > K; K++)
													M[V + o] = 0, w--, o++;
											for (; 0 < w && o < b;)
												M[V + o] = 0, w--, o++
										} else {
											for (; 0 != (w & -8) && o + 8 < b;)
												for (K = 0; 8 > K; K++)
													M[V + o] = M[ua + o], w--, o++;
											for (; 0 < w && o < b;)
												M[V + o] = M[ua + o], w--, o++
										}
										break;
									case 1 :
										if (-1 == ua) {
											for (; 0 != (w & -8) && o + 8 < b;)
												for (K = 0; 8 > K; K++)
													M[V + o] = Ka, w--, o++;
											for (; 0 < w && o < b;)
												M[V + o] = Ka, w--, o++
										} else {
											for (; 0 != (w & -8) && o + 8 < b;)
												for (K = 0; 8 > K; K++)
													M[V + o] = M[ua + o] ^ Ka, w--, o++;
											for (; 0 < w && o < b;)
												M[V + o] = M[ua + o] ^ Ka, w--, o++
										}
										break;
									case 2 :
										if (-1 == ua) {
											for (; 0 != (w & -8) && o + 8 < b;)
												for (K = 0; 8 > K; K++)
													U <<= 1, U &= 255, 0 == U
															&& (Ta = 0 != Ja
																	? Ja & 255
																	: a[Y++], U = 1), M[V
															+ o] = 0 != (Ta & U)
															? Ka
															: 0, w--, o++;
											for (; 0 < w && o < b;)
												U <<= 1, U &= 255, 0 == U
														&& (Ta = 0 != Ja ? Ja
																& 255 : a[Y++], U = 1), M[V
														+ o] = 0 != (Ta & U)
														? Ka
														: 0, w--, o++
										} else {
											for (; 0 != (w & -8) && o + 8 < b;)
												for (K = 0; 8 > K; K++)
													U <<= 1, U &= 255, 0 == U
															&& (Ta = 0 != Ja
																	? Ja & 255
																	: a[Y++], U = 1), M[V
															+ o] = 0 != (Ta & U)
															? M[ua + o] ^ Ka
															: M[ua + o], w--, o++;
											for (; 0 < w && o < b;)
												U <<= 1, U &= 255, 0 == U
														&& (Ta = 0 != Ja ? Ja
																& 255 : a[Y++], U = 1), M[V
														+ o] = 0 != (Ta & U)
														? M[ua + o] ^ Ka
														: M[ua + o], w--, o++
										}
										break;
									case 3 :
										for (; 0 != (w & -8) && o + 8 < b;)
											for (K = 0; 8 > K; K++)
												M[V + o] = Hb, w--, o++;
										for (; 0 < w && o < b;)
											M[V + o] = Hb, w--, o++;
										break;
									case 4 :
										for (; 0 != (w & -8) && o + 8 < b;)
											for (K = 0; 8 > K; K++)
												M[V + o] = fetchMicColor(a, Y,
														k), Y += k, w--, o++;
										for (; 0 < w && o < b;)
											M[V + o] = fetchMicColor(a, Y, k), Y += k, w--, o++;
										break;
									case 8 :
										for (; 0 != (w & -8) && o + 8 < b;)
											for (K = 0; 8 > K; K++)
												Ua
														? (M[V + o] = Hb, Ua = false)
														: (M[V + o] = hb, Ua = true, w++), w--, o++;
										for (; 0 < w && o < b;)
											Ua
													? (M[V + o] = Hb, Ua = false)
													: (M[V + o] = hb, Ua = true, w++), w--, o++;
										break;
									case 13 :
										for (; 0 != (w & -8) && o + 8 < b;)
											for (K = 0; 8 > K; K++)
												M[V + o] = 16777215, w--, o++;
										for (; 0 < w && o < b;)
											M[V + o] = 16777215, w--, o++;
										break;
									case 14 :
										for (; 0 != (w & -8) && o + 8 < b;)
											for (K = 0; 8 > K; K++)
												M[V + o] = 0, w--, o++;
										for (; 0 < w && o < b;)
											M[V + o] = 0, w--, o++;
										break;
									default :
										throw "Unimplemented decompress opcode "
												+ Z;
								}
							}
						}
						ma = M
				}
			}
			1 > e
					|| 1 > t
					|| (instance.backImageBuffer.setRGBs(c, i, e, t, ma, 0, b), instance.backImageBuffer
							.repaint(c, i, e, t))
		}
	}
	function textCacheItem(a, b) {
		this.size = a;
		this.data = b
	}
	function fontCacheItem(a, b, d, c, i, e, f) {
		this.font = a;
		this.character = b;
		this.offset = d;
		this.baseLine = c;
		this.width = i;
		this.height = e;
		this.fontData = f
	}
	function mergeNAnd(a, b, d, c, i, e, f) {
		for (var k = i * d + c, l = a.setRGB, g = a.getRGB, h = 0; h < f; h++) {
			for (var m = 0; m < e; m++) {
				if (null != a) {
					var j = g(c + m, i + h);
					l(c + m, i + h, ~j & ra)
				} else
					b[k] = ~b[k] & ra;
				k++
			}
			k += d - e
		}
	}
	function fillColor(a, b, d, c, i, e, f, k, l, g, h) {
		if (!(0 > e | 0 > f | 0 > d | 0 > l))
			switch (a) {
				case 0 :
					k = b.setRGB;
					for (l = c; l < c + e; l++)
						for (b = i; b < i + f; b++)
							k(l, b, 0);
					break;
				case 1 :
					a = h * l + g;
					d = b.setRGB;
					for (g = 0; g < f; g++) {
						for (h = 0; h < e; h++)
							d(c + e, i + f, ~(b.getRGB(c + e, i + f) | k[a])
											& ra);
						a += l - e
					}
					break;
				case 2 :
					a = h * l + g;
					d = b.setRGB;
					b = b.getRGB;
					for (g = 0; g < f; g++) {
						for (h = 0; h < e; h++) {
							var m = b(c + e, i + f);
							d(c + e, i + f, m & ~k[a] & ra);
							a++
						}
						a += l - e
					}
					break;
				case 3 :
					mergeNAnd(b, k, l, g, h, e, f);
					null == k ? b.copyArea(g, h, e, f, c - g, i - h) : b
							.setRGBs(c, i, e, f, k, 0, l);
					break;
				case 4 :
					mergeNAnd(b, null, d, c, i, e, f);
					mergeAnd(b, d, c, i, e, f, k, l, g, h);
					break;
				case 5 :
					mergeNAnd(b, null, d, c, i, e, f);
					break;
				case 6 :
					a = h * l + g;
					d = b.setRGB;
					b = b.getRGB;
					for (g = 0; g < f; g++) {
						for (h = 0; h < e; h++)
							m = b(c + h, i + g), d(c + h, i + g, m ^ k[a] & ra), a++;
						a += l - e
					}
					break;
				case 7 :
					a = h * l + g;
					d = b.setRGB;
					b = b.getRGB;
					for (g = 0; g < f; g++) {
						for (h = 0; h < e; h++)
							m = b(c + h, i + g), d(c + h, i + g, ~(m & k[a])
											& ra), a++;
						a += l - e
					}
					break;
				case 8 :
					mergeAnd(b, d, c, i, e, f, k, l, g, h);
					break;
				case 9 :
					a = h * l + g;
					d = b.setRGB;
					b = b.getRGB;
					for (g = 0; g < f; g++) {
						for (h = 0; h < e; h++)
							m = b(c + h, i + g), d(c + h, i + g, m ^ ~k[a] & ra), a++;
						a += l - e
					}
					break;
				case 10 :
					break;
				case 11 :
					a = h * l + g;
					d = b.setRGB;
					b = b.getRGB;
					for (g = 0; g < f; g++) {
						for (h = 0; h < e; h++)
							m = b(c + h, i + g), d(c + h, i + g, m | ~k[a] & ra), a++;
						a += l - e
					}
					break;
				case 12 :
					null == k ? b.copyArea(g, h, e, f, c - g, i - h) : b
							.setRGBs(c, i, e, f, k, 0, l);
					break;
				case 13 :
					mergeNAnd(b, null, d, c, i, e, f);
					mergeAndOr(b, d, c, i, e, f, k, l, g, h);
					break;
				case 14 :
					mergeAndOr(b, d, c, i, e, f, k, l, g, h);
					break;
				case 15 :
					k = b.setRGB;
					for (l = c; l < c + e; l++)
						for (b = i; b < i + f; b++)
							k(l, b, ra);
					break;
				default :
					lg("unsupported opcode: " + a)
			}
	}
	function mergeAnd(a, b, d, c, i, e, f, k, l, g) {
		b = g * k + l;
		l = a.setRGB;
		a = a.getRGB;
		for (g = 0; g < e; g++) {
			for (var h = 0; h < i; h++) {
				var m = a(d + h, c + g);
				l(d + h, c + g, m & f[b] & ra);
				b++
			}
			b += k - i
		}
	}
	function mergeAndOr(a, b, d, c, i, e, f, k, l, g) {
		b = g * k + l;
		l = a.setRGB;
		a = a.getRGB;
		for (g = 0; g < e; g++) {
			for (var h = 0; h < i; h++) {
				var m = a(d + h, c + g);
				l(d + h, c + g, m | f[b] & ra);
				b++
			}
			b += k - i
		}
	}
	function getFontFromCache(instance, a, b) {
		if (12 > a && 256 > b) {
			var d = instance.fontCache[a][b];
			if (null != d)
				return d
		}
		return null
	}
	function bitmapCacheItem(d, w, h, l, t, b) {
		this.byteArray = d;
		this.left = l;
		this.top = t;
		this.width = w;
		this.height = h;
		this.bitsperpixel = b;
		this.bytesperpixel = Math.floor((b + 7) / 8);// Bpp
	}
	function adjustColorDepth(instance, a, b, d, c) {
		switch (b) {
			case 16 :
				var b = a >> 8 & 248, i = a >> 3 & 252, a = a << 3 & 255;
				d[c] = b | b >> 5;
				d[c + 1] = i | i >> 6;
				d[c + 2] = a | a >> 5;
				d[c + 3] = 255;
				break;
			case 15 :
				b = a >> 7 & 248;
				i = a >> 2 & 248;
				a = a << 3 & 255;
				d[c] = b | b >> 5;
				d[c + 1] = i | i >> 5;
				d[c + 2] = a | a >> 5;
				d[c + 3] = 255;
				break;
			case 8 :
				d[c] = instance.defaultPalett[0][a];
				d[c + 1] = instance.defaultPalett[1][a];
				d[c + 2] = instance.defaultPalett[2][a];
				d[c + 3] = 255;
				break;
			case 32 :
				d[c] = a >> 16 & 255, d[c + 1] = a >> 8 & 255, d[c + 2] = a
						& 255, d[c + 3] = a >> 24 & 255;
			default :
				d[c] = a >> 16 & 255, d[c + 1] = a >> 8 & 255, d[c + 2] = a
						& 255, d[c + 3] = 255
		}
	}
	function fetchMicColor(a, b, d) {
		for (var c = 0, d = d - 1; 0 <= d; d--)
			c <<= 8, c |= a[b + d] & 255;
		return c
	}
	function fetchDotColor(a, b) {
		var d = a[b] & 255, c = (a[b + 1] & 255) << 8 | d, i = c >> 8 & 248, c = c >> 3
				& 252, d = d << 3 & 255;
		return (i | i >> 5) << 16 | (c | c >> 6) << 8 | d | d >> 5
	}
	function fetchOddColor(a, b) {
		var d = a[b] & 255, c = (a[b + 1] & 255) << 8 | d, i = c >> 7 & 248, c = c >> 2
				& 248, d = d << 3 & 255;
		return (i | i >> 5) << 16 | (c | c >> 5) << 8 | d | d >> 5
	}
	function fetchEvenColor(a, b, d) {
		return a = 0 | a[b + d] & 255
	}
	function Qb(a, b, d, c, i, e) {// todo 查明32的意义
		var f, k, l, g, h, m, j, n, p = b, u = e;
		for (k = j = 0; k < c;) {
			e = u + 4 * d * c - 4 * (k + 1) * d;
			h = 0;
			n = e;
			f = 0;
			if (0 == j)
				for (; f < d;) {
					l = a[b++] & 255;
					g = l & 15;
					l = l >> 4 & 15;
					m = g << 4 | l;
					47 >= m && 16 <= m && (g = m, l = 0);
					for (; 0 < l;)
						h = a[b++] & 255, i[e] = h, e += 4, f++, l--;
					for (; 0 < g;)
						i[e] = h, e += 4, f++, g--
				}
			else
				for (; f < d;) {
					l = a[b++] & 255;
					g = l & 15;
					l = l >> 4 & 15;
					m = g << 4 | l;
					47 >= m && 16 <= m && (g = m, l = 0);
					for (; 0 < l;)
						m = a[b++] & 255, 0 != (m & 1)
								? (m >>= 1, m += 1, h = -m)
								: h = m >>= 1, m = i[j + 4 * f] + h, i[e] = m, e += 4, f++, l--;
					for (; 0 < g;)
						m = i[j + 4 * f] + h, i[e] = m, e += 4, f++, g--
				}
			k++;
			j = n
		}
		return b - p
	}
	function wrappedImage(a, b, d) {
		var c = a.length, i = 0, e = d - b;
		this.next = function() {
			0 != e && i % d >= b && (i += e);
			if (i < c)
				return a[i++];
			throw "Out of range";
		}
	}

	function parseHex(str, oid) {
		if (str.indexOf("0x") == 0)
			str = str.substring(2);
		return parseInt(str, oid);
	}

	function seamlessCommand(instance, line) {

		var tok = line.split(",");
		if (tok.length < 2)
			return true;
		var ord = parseInt(tok[0].substring(2, 4), 10);
		lg("receive command "+line + "---" + ord);
		switch (ord) {
			case 1 :
				if (tok.length < 6)
					return false;
				var id = parseHex(tok[2], 16);
				var group = parseHex(tok[3], 16);
				var parent = parseHex(tok[4], 16);
				var flags = parseHex(tok[5], 16);
				var win = instance.creatWindow(id, group, parent, flags)
				break;

			case 2 :
				if (tok.length < 4)
					return false;
				var id = parseHex(tok[2], 16);
				var flags = parseHex(tok[3], 16);
				var win = instance.windowManager.get(id);
				win && win.close();
				break;

			case 3 :
				if (tok.length < 4)
					return false;
				var id = parseHex(tok[2], 16);
				var flags = parseHex(tok[3], 16);
				instance.windowManager.destroyGroup(id);
				break;

			case 4 :
				var id = parseInt(tok[1]);
				var win = instance.windowManager.get(id);
				win && win.isRootFrame && win.setIcon(tok[2]);
				break;

			case 6 :
				if (tok.length < 8)
					return false;
				var id = parseHex(tok[2], 16);
				if (instance.mousedown === true) {
					var s = instance.lockScreen;
					if (s.lastX != -1) {
						var w = instance.getWindow(s.beginX, s.beginY);
						if (w != null && w.id == id) {
							if (s.locked === false
									&& w.width == parseInt(tok[5], 10)
									&& w.height == parseInt(tok[6], 10)) {
								s.lock(w);
							}
							return;
						}
					}
				}
				var win = instance.windowManager.get(id);
				win && win.updateBox({
							x : parseHex(tok[3], 10),
							y : parseHex(tok[4], 10),
							width : parseHex(tok[5], 10),
							height : parseHex(tok[6], 10)
						});
				instance.repaintAll(300);
				break;
			case 7 :
				if (tok.length < 5)
					return false;
				var id = parseHex(tok[2], 16);
				var behind = parseHex(tok[3], 16);
				// var flags = parseHex(tok[4], 16);
				var win = instance.windowManager.get(id);
				if (win != null) {
					if (behind != 0) {// TODO 调入某个层位以下
					} else {
						win.toFront();
					}
				}
				break;

			case 8 :
				if (tok.length < 5)
					return false;
				var id = parseHex(tok[2], 16);
				var flags = parseHex(tok[4], 16);
				var win = instance.windowManager.get(id);
				win && win.isRootFrame && win.setTitle(tok[3]);
				break;
			case 9 :
				var id = parseHex(tok[2], 16);
				var flags = parseHex(tok[3], 16);
				var win = instance.windowManager.get(id);
				win && win.setState(flags);
				break;
			case 12 :
				var root = instance.getFocus();
				root != null && root.repaint();
				instance.setMask(false);
				break;
			case 14 :
				if (instance.lockScreen.locked === true) {
					var s = instance.lockScreen;
					s.unlock();
				}
				break;
			case 17 :
				instance.destroy();
				break;
			case 18 :// FOCUS
				instance.repaintAll();
				break;

		}
		return true;
	}

	return {
		c : 0,
		updateSplash : false,
		onMessageArrive : function(instance, a) {

			var b, a = a.data;
			if ("string" == typeof a) {
				b = parseInt(a.substring(0, 2), 16);
				var d = a.substring(2);

				lg("string pack :" + b);
				switch (b) {
					case 26 :
						instance.displayMsg && Ext.msg("INFO", d);
						break;
					case 27 :
						// Rdp.drawLicense(d);
						break;
					case 28 :
						instance.destroy();
						if (d) {
							Ext.msg("ERROR", d);
						} else {
							lib.rdp.Splash.hide();
						}
						break;
					case 31 :
						instance.setMask(false);
					case 48 :
						processRdpPackage(instance, decodePackageFunction(d));
						break;
					case 49 :
						processRdp5Package(instance, decodePackageFunction(d));
						break;

					case 51 :
						// Rdp.setReadOnly("1" == d);
						// TODO setReadOnly
						break;
					case 52 :
						a = {};
						a.t = instance.textCache;
						a.f = instance.fontCache;
						a = "89" + JSON.stringify(a);
						instance.websocket.send(a);
						break;
					case 53 :
						a = JSON.parse(d);
						instance.textCache = a.t;
						instance.fontCache = a.f;
						break;
					case 54 :
						a = instance.host + d;
						lg("Downloading file:" + a);
						b = instance.getFocused();
						// null != b && b.showPDF(a);
						// TODO showPdf
						break;
					case 55 :
						a = parseInt(d.substring(0, 1), 16);
						b = d.substring(1);
						switch (a) {
							case 0 :
								a = b.split("\t");
								C = parseInt(a[0]);
								H = parseInt(a[1]);
								G = parseInt(a[2]);
								E = parseInt(a[3]);
								lg("Audio Format, tag=" + C + " channels=" + H
										+ " bitsPerSample=" + G
										+ " samplePerSec=" + E);
								Ext.isFirefox
										&& null == Za
										&& (Za = new lib.rdp.sound.playAudio(2));
								break;
							case 1 :
								lib.rdp.sound.playBell(b)
						}

						switch (d.getByte()) {
							case 0 :
								C = d.getLittleEndian16();
								H = d.getLittleEndian16();
								E = d.getLittleEndian32();
								d.skipPosition(6);
								G = d.getLittleEndian16();
								lg("Audio Format, tag=" + C + " channels=" + H
										+ " bitsPerSample=" + G
										+ " samplePerSec=" + E);
								Ext.isFirefox
										&& null == Za
										&& (Za = new lib.rdp.sound.playAudio(2));
								break;
							case 1 :
								lib.rdp.sound.playSound(instance, d)
						}
						break;
					case 56 :
						instance.uuid = d;
						break;
					case 58 :
						b = d;
						if (null != instance.fileUploadManagerInstance)
							if (a = parseInt(b.charAt(0)), b = b.substring(1), 5 == a) {
								// instanceControler.notifyFiles(JSON.parse(b));
							} else
								switch (b = b.split("\t"), a) {
									case 1 :
										instance.fileUploadManagerInstance
												.confirmId(b[0], b[1]);
										break;
									case 2 :
										instance.fileUploadManagerInstance
												.read(b[0], parseInt(b[1]),
														parseInt(b[2]));
										break;
									case 4 :
										instance.fileUploadManagerInstance
												.close(b[0])
								}
						break;
					case 59 :
						if (instance.mapDisk) {
							a = lib.rdp.Base64.dec(d, 0);
							if ((new lib.rdp.DataPackage(a, 0, a.length))
									.getLittleEndian32()
									& 16) {
							} else {
								instance.mapDisk = false;
								instance.fileUploadManagerInstance = null;
								// instance.execute("setFileHandler",[null]);
							}
						}
						break;
					case 90 :
						instance.websocket.send("5B" + lib.rdp.Clipboard.data);
						break;
					case 92 :
						lib.rdp.Clipboard.data = d;
						lib.rdp.Clipboard.copyToLocal(d);
					case 95 :
						seamlessCommand(instance, a);
						break;
					default :
						lg("@TODO:" + a + "\n")
				}
			} else {
				var b = new Int8Array(a);
				var d = new lib.rdp.DataPackage(b, 0, b.length);
				b = d.getLittleEndian16();
				lg("binary pack :" + b);
				switch (b) {
					case 48 :
						processRdpPackage(instance, d);
						break;
					case 49 :
						processRdp5Package(instance, d);
						break;
					case 55 :
						switch (d.getByte()) {
							case 0 :
								C = d.getLittleEndian16();
								H = d.getLittleEndian16();
								E = d.getLittleEndian32();
								d.skipPosition(6);
								G = d.getLittleEndian16();
								lg("Audio Format, tag=" + C + " channels=" + H
										+ " bitsPerSample=" + G
										+ " samplePerSec=" + E);
								Ext.isFirefox
										&& null == Za
										&& (Za = new lib.rdp.sound.playAudio(2));
								break;
							case 1 :
								lib.rdp.sound.playSound(instance, d)
						}
						break;
					default :
						lg("@TODO:" + a + "\n")
				}
			}
			this.updateSplash && lib.rdp.Splash.increase();
		}

	}
}();

lib.rdp.Base64 = {
	table : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
			.split(""),
	pad : "=",
	enc : function(a) {
		var b = "", d = this.table, c = this.pad, i = a.length, e;
		for (e = 0; e < i - 2; e += 3)
			b += d[a[e] >> 2], b += d[((a[e] & 3) << 4) + (a[e + 1] >> 4)], b += d[((a[e
					+ 1] & 15) << 2)
					+ (a[e + 2] >> 6)], b += d[a[e + 2] & 63];
		i
				% 3
				&& (e = i - i % 3, b += d[a[e] >> 2], 2 === i % 3
						? (b += d[((a[e] & 3) << 4) + (a[e + 1] >> 4)], b += d[(a[e
								+ 1] & 15) << 2], b += c)
						: (b += d[(a[e] & 3) << 4], b += c + c));
		return b
	},
	binaries : [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53,
			54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2,
			3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
			21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31,
			32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
			49, 50, 51, -1, -1, -1, -1, -1],
	dec : function(a, b) {
		var d = this.binaries, c = this.pad, i, e, f, k, l, g = 0, h = 0;
		i = a.indexOf("=") - b;
		0 > i && (i = a.length - b);
		i = Array(3 * (i >> 2) + Math.floor(i % 4 / 1.5));
		for (e = 0, f = b; f < a.length; f++)
			k = d[a.charCodeAt(f) & 127], l = a.charAt(f) === c, -1 === k
					? console.error("Illegal character '" + a.charCodeAt(f)
							+ "'")
					: (h = h << 6 | k, g += 6, 8 <= g
							&& (g -= 8, l || (i[e++] = h >> g & 255), h &= (1 << g)
									- 1));
		if (g)
			throw "Invalid base64 encoding";
		return i
	}
};

lib.rdp.OrderState = {
	initState : function(instance) {
		Ext.apply(instance, {
					orderType : 1,
					bounds : new this.BoundsOrder(),
					destBlt : new this.DestBltOrder(),
					patBlt : new this.PatBltOrder(this),
					screenBlt : new this.ScreenBltOrder(),
					line : new this.LineOrder(this),
					rectangle : new this.RectangleOrder(),
					deskSave : new this.DeskSaveOrder(),
					memBlt : new this.MemBltOrder(),
					triBlt : new this.TriBltOrder(this),
					polyLine : new this.PolyLineOrder(),
					text2 : new this.Text2Order()
				})

	},
	Brush : function() {
		this.style = this.yOrigin = this.xOrigin = 0;
		this.pattern = Array(8)
	},
	BoundsOrder : function() {
		this.bottom = this.top = this.right = this.left = 0
	},
	DeskSaveOrder : function() {
		this.action = this.offset = this.bottom = this.top = this.right = this.left = 0
	},
	DestBltOrder : function() {
		this.opcode = this.cy = this.cx = this.y = this.x = 0
	},
	LineOrder : function(obj) {
		this.opcode = this.backgroundColor = this.endY = this.endX = this.startY = this.startX = this.mixmode = 0;
		this.pen = new obj.Pen
	},
	MemBltOrder : function() {
		this.cacheIDX = this.cacheID = this.colorTable = this.srcY = this.srcX = this.opcode = this.cy = this.cx = this.y = this.x = 0
	},
	PatBltOrder : function(obj) {
		this.foregroundColor = this.backgroundColor = this.opcode = this.cy = this.cx = this.y = this.x = 0;
		this.brush = new obj.Brush
	},
	Pen : function() {
		this.color = this.width = this.style = 0
	},
	PolyLineOrder : function() {
		this.dataSize = this.opcode = this.lines = this.foregroundColor = this.flags = this.y = this.x = 0;
		this.data = Array(256)
	},
	RectangleOrder : function() {
		this.color = this.cy = this.cx = this.y = this.x = 0
	},
	ScreenBltOrder : function() {
		this.srcY = this.srcX = this.opcode = this.cy = this.cx = this.y = this.x = 0
	},
	Text2Order : function() {
		this.length = this.opcode = this.boxBottom = this.boxRight = this.boxTop = this.boxLeft = this.clipBottom = this.clipRight = this.clipTop = this.clipLeft = this.font = this.unknown = this.y = this.x = this.backgroundColor = this.foregroundColor = this.mixmode = this.flags = 0;
		this.text = Array(256)
	},
	TriBltOrder : function(obj) {
		this.foregroundColor = this.backgroundColor = this.opcode = this.cy = this.cx = this.y = this.x = 0;
		this.brush = new obj.Brush;
		this.unknown = this.srcY = this.srcX = this.cacheIDX = this.cacheID = this.colorTable = 0
	}
}
lib.rdp.DataPackage = function(a, b, d) {
	var c = b;
	var start = 0;
	var end = b + d;
	this.markEnd = function() {
		end = getPosition()
	};
	this.markEnd = function(a) {
		end = a
	};
	this.getEnd = function() {
		return end
	};
	this.getStart = function() {
		return start
	};
	this.setStart = function(a) {
		start = a
	};
	this.getByte = function() {
		return a[c++] & 255
	};
	this.getBytes = function(b) {
		for (var d = Array(b), f = 0; f < b; f++)
			d[f] = a[c + f];
		c += b;
		return d
	};
	this.getCapacity = function() {
		return a.length
	};
	this.size = function() {
		return d
	};
	this.getPosition = function() {
		return c
	};
	this.getLittleEndian16 = function() {
		var b = (a[c + 1] & 255) << 8 | a[c] & 255;
		c += 2;
		return b
	};
	this.getBigEndian16 = function() {
		var b = (a[c] & 255) << 8 | a[c + 1] & 255;
		c += 2;
		return b
	};
	this.getLittleEndian32 = function() {
		var b = (a[c + 3] & 255) << 24 | (a[c + 2] & 255) << 16
				| (a[c + 1] & 255) << 8 | a[c] & 255;
		c += 4;
		return b
	};
	this.getLittleEndian64 = function() {
		var b = (a[c + 7] & 255) << 56 | (a[c + 6] & 255) << 48
				| (a[c + 5] & 255) << 40 | (a[c + 4] & 255) << 32
				| (a[c + 3] & 255) << 24 | (a[c + 2] & 255) << 16
				| (a[c + 1] & 255) << 8 | a[c] & 255;
		c += 8;
		return b
	};
	this.getBigEndian32 = function() {
		var b = (a[c] & 255) << 24 | (a[c + 1] & 255) << 16
				| (a[c + 2] & 255) << 8 | a[c + 3] & 255;
		c += 4;
		return b
	};
	this.getUnicodeString = function(a, b) {
		for (var c = Math.floor(a / 2), d = "", f = 0; f < c; f++) {
			var g = this.getLittleEndian16();
			if (b && 0 == g) {
				this.skipPosition(2 * (c - f - 1));
				break
			}
			d += String.fromCharCode(g)
		}
		return d
	};
	this.skipPosition = function(a) {
		c += a
	};
	this.setPosition = function(a) {
		c = a
	};
	this.getData = function() {
		return a
	};
	this.setByte = function(b) {
		a[c++] = b
	};
	this.setLittleEndian16 = function(b) {
		a[c++] = b & 255;
		a[c++] = b >> 8 & 255
	};
	this.setLittleEndian32 = function(b) {
		a[c++] = b & 255;
		a[c++] = b >> 8 & 255;
		a[c++] = b >> 16 & 255;
		a[c++] = b >> 24 & 255
	}
}

lib.rdp.WebAudioContext = function(a) {
	var b = null;
	this.available = false;
	this.delay = a;
	if (Ext.isTouch)
		this.available = false;
	else if ("webkitAudioContext" in window)
		b = new webkitAudioContext, this.available = true;
	else if ("AudioContext" in window)
		b = new AudioContext, this.available = true;
	else if (Ext.isFirefox) {
		this.available = true;
		return
	}
	if (this.available) {
		this.getBuffer = function(a) {
			return b.createBuffer(2, a, E)
		};
		var d = 0;
		this.playBuffer = function(c) {
			var f = b.createBufferSource();
			f.buffer = c;
			f.connect(b.destination);
			var e = b.currentTime, j = 0 < d ? d : e + a;
			j < e && (j = e + a);
			d = j + c.duration;
			f.noteOn(j);
			return d - e
		}
	}
}

lib.rdp.sound = function() {
	var l, k, g;
	var webAudioContext = new lib.rdp.WebAudioContext(2);
	function decompressSound(a, b) {
		var d = Math.pow(2, b - 1) - 1, c = -d - 1;
		a > d ? (a -= Math.pow(2, b), a /= -c) : a /= d;
		return a
	}
	function soundControler(a, b, d) {
		function c() {
			var a;
			if (k) {
				a = i.mozWriteAudio(k.subarray(l));
				e += a;
				l += a;
				if (l < k.length)
					return;
				k = null
			}
			a = i.mozCurrentSampleOffset() + t - e;
			if (0 < a) {
				var b = new Float32Array(a);
				d(b);
				a = i.mozWriteAudio(b);
				a < b.length && (k = b, l = a);
				e += a
			}
		}
		var i = new Audio;
		i.mozSetup(a, b);
		var e = 0, t = a * b / 2, k = null, l = 0, g = null;
		this.start = function() {
			g = setInterval(c, 100)
		};
		this.stop = function() {
			null != g && clearInterval(g)
		}
	}
	return {
		setAudioBuffer : function(a) {
			webAudioContext.delay = a
		},
		playBell : function(instance, a) {
			function b(a) {
				var b = 0, a = a * k;
				for (g = 0; g < k; g++)
					b |= (e[a + g] & 255) << 8 * g;
				return decompressSound(b, t)
			}
			function d() {
				instance.websocket.send("8A" + i)
			}
			if (webAudioContext.available) {
				var c = a.indexOf("\t"), i = a.substring(0, c), e = lib.rdp.Base64
						.dec(a, c + 1), t = G, k = t >> 3, l = Math
						.floor(e.length / k), g = 0, a = 0;
				if (Ext.isFirefox) {
					c = Array(l);
					for (a = 0; a < l; a++)
						c[a] = b(a);
					a = Za.add(c);
					setTimeout(d, a - 1E3 * webAudioContext.delay)
				} else {
					for (var c = H, l = Math.floor(l / c), h = webAudioContext
							.getBuffer(l), m = h.getChannelData(0), f = h
							.getChannelData(1), a = 0; a < l;) {
						var n = 2 * a, j = b(n);
						1 == c
								? (j *= 0.707, m[a] = j, f[a] = j)
								: (m[a] = j, f[a] = b(n + 1));
						a++
					}
					a = webAudioContext.playBuffer(h);
					setTimeout(d, 1E3 * (a - webAudioContext.delay))
				}
			}
		},
		playSound : function(instance, a) {
			function b(a) {
				var b = 0, a = a * k + i;
				for (g = 0; g < k; g++)
					b |= (e[a + g] & 255) << 8 * g;
				return decompressSound(b, t)
			}
			function d() {
				instance.websocket.send("8A" + c)
			}
			if (webAudioContext.available) {
				var c = a.getByte() + "," + a.getLittleEndian16() + ","
						+ a.getLittleEndian64(), i = a.getPosition(), e = a
						.getData(), a = a.getEnd() - i, t = G, k = t >> 3, l = Math
						.floor(a / k), g = 0, a = 0;
				if (Ext.isFirefox) {
					for (var h = Array(l), a = 0; a < l; a++)
						h[a] = b(a);
					a = Za.add(h);
					setTimeout(d, a - 1E3 * webAudioContext.delay)
				} else {
					for (var h = H, l = Math.floor(l / h), m = webAudioContext
							.getBuffer(l), f = m.getChannelData(0), n = m
							.getChannelData(1), a = 0; a < l;) {
						var j = 2 * a, p = b(j);
						1 == h
								? (p *= 0.707, f[a] = p, n[a] = p)
								: (f[a] = p, n[a] = b(j + 1));
						a++
					}
					a = webAudioContext.playBuffer(m);
					setTimeout(d, 1E3 * (a - webAudioContext.delay))
				}
			}
		},
		playAudio : function(a) {
			var b = [], d, c, i, e = new soundControler(H, E, function(b) {
						var d = b.length, e = d > t.size();
						if (c || e)
							t.stop(), setTimeout(function() {
										t.start()
									}, 1E3 * a);
						else
							for (e = 0; e < d; e++)
								b[e] = t.pull()
					}), t = this;
			this.delay = a;
			this.reset = function() {
				d = b.length = 0;
				c = true;
				e.stop();
				i = 0
			};
			this.reset();
			this.start = function() {
				c && (e.start(), c = false)
			};
			this.stop = function() {
				e.stop();
				c = true
			};
			this.size = function() {
				for (var a = b.length, c = 0, d = 0; d < a; d++)
					c += b[d].length;
				return c
			};
			this.add = function(c) {
				var d = (new Date).getTime();
				i < d && (i = d);
				i += 1E3 * (c.length / (E * H));
				var g = b.length;
				b[g] = c;
				0 == g && (d = (new Date).getTime(), setTimeout(function() {
							e.start()
						}, 1E3 * a));
				return i - d
			};
			this.pull = function() {
				if (0 == b.length)
					return null;
				var a = b[0];
				if (d < a.length)
					return a[d++];
				b.shift();
				d = 0;
				return this.pull()
			}
		}

	};
}();
