(function p(global) {
  // 基础缓动函数
  var penner = function penner() {
    // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)
    var eases = {
      linear: function linear() {
        return function (t) {
          return t;
        };
      }
    };
    var functionEasings = {
      Sine: function Sine() {
        return function (t) {
          return 1 - Math.cos(t * Math.PI / 2);
        };
      },
      Circ: function Circ() {
        return function (t) {
          1 - Math.sqrt(1 - t * t);
        };
      },
      Back: function Back() {
        return function (t) {
          return t * t * (3 * t - 2);
        };
      },
      Bounce: function Bounce() {
        return function (t) {
          var pow2,
            b = 4;
          while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) { }
          return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
        };
      }
    };
    var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
    baseEasings.forEach(function (name, i) {
      functionEasings[name] = function () {
        return function (t) {
          return Math.pow(t, i + 2);
        };
      };
    });
    Object.keys(functionEasings).forEach(function (name) {
      var easeIn = functionEasings[name];
      eases['easeIn' + name] = easeIn;
      eases['easeOut' + name] = function () {
        return function (t) {
          return 1 - easeIn()(1 - t);
        };
      };
      eases['easeInOut' + name] = function () {
        return function (t) {
          return t < 0.5 ? easeIn()(t * 2) / 2 : 1 - easeIn()(t * -2 + 2) / 2;
        };
      };
      eases['easeOutIn' + name] = function () {
        return function (t) {
          return t < 0.5 ? (1 - easeIn()(1 - t * 2)) / 2 : (easeIn()(t * 2 - 1) + 1) / 2;
        };
      };
    });
    return eases;
  };

  /**
   * 
   * Author: D-Sketon
   * Date: 2023-04-10
   */
  var engine = function (anime) {
    /// 目前仅支持translate
    var validTransform = ['translateX', 'translateY', 'translateZ'];

    function selectKey(target, key) {
      if (target instanceof HTMLElement && target.style && 'transform' in target.style && validTransform.indexOf(key) != -1) {
        return 'transform';
      } else if (target instanceof HTMLElement && target.style && key in target.style) {
        return 'style';
      } else {
        return 'attribute';
      }
    }

    // 动画开始时间
    var start = Date.now() + anime.delay;
    // 动画结束时间
    var end = start + anime.duration;
    // target是否有效
    var isValid = !!anime.targets;
    var cloneTargets = [];

    // 初始化cloneTargets
    function initTarget() {
      if (!isValid) return;
      // 将targets转换为array便于处理
      if (!(anime.targets instanceof Array)) {
        anime.targets = [anime.targets];
      }
      for (var i = 0; i < anime.targets.length; i++) {
        var target = anime.targets[i];
        var cloneTarget = {};
        for (var key in anime.dest) {
          if (anime.dest[key] instanceof Array) {
            // [0,100]类型，from-to模式
            if (anime.dest[key].length === 2 && typeof anime.dest[key][0] !== 'object') {
              // 强制改变当前初始状态
              //需考虑是否为style/transform/attribute
              switch (selectKey(target, key)) {
                case 'transform':
                  if (typeof anime.dest[key][0] === 'string') {
                    target.style.transform = key + '(' + anime.dest[key][0] + ')';
                  } else {
                    target.style.transform = key + '(' + anime.dest[key][0] + 'px)';
                  }
                  break;
                case 'style':
                  target['style'][key] = anime.dest[key][0];
                  break;
                case 'attribute':
                  target[key] = anime.dest[key][0];
                  break;
              }
              cloneTarget[key] = anime.dest[key][0];
              anime.dest[key] = anime.dest[key][1];
            } else {
              // keyframe类型
              // 支持 [{value: 1, duration: 500, easing: 'linear'},{value: 2, duration: 500, easing: 'linear'}]
              // value 和 duration 是必须的
              // 为dest绑定startTimeStamp，便于之后判断keyframe
              var startTmp = 0;
              for (var k = 0; k < anime.dest[key].length; k++) {
                anime.dest[key][k].startTimeStamp = startTmp;
                startTmp += anime.dest[key][k].duration;
              }
              cloneTarget[key] = target[key];
            }
          } else {
            var keyType = selectKey(target, key);
            switch (keyType) {
              case 'transform':
                var regex = new RegExp("".concat(key, "((w+))"), 'g');
                // is it true?
                cloneTarget[key] = target.style.transform.match(regex)[0];
                break;
              case 'style':
                cloneTarget[key] = target['style'][key];
                break;
              case 'attribute':
                cloneTarget[key] = target[key];
            }
          }
        }
        cloneTargets.push(cloneTarget);
      }
    }

    // 改变target单个key的属性
    function change(target, origin, elapsed, value, key, _final) {
      var keyCode;
      if (typeof value === 'string') {
        if (value[value.length - 1] === '%') {
          keyCode = '%';
          value = parseFloat(value);
        } else if (value[value.length - 1] === 'x' && value[value.length - 2] === 'p') {
          keyCode = 'px';
          value = parseFloat(value);
        } else {
          throw new TypeError("string value must ends with '%' or 'px'");
        }
      }
      var nextValue = _final ? value : (value - origin) * elapsed + origin;
      if (keyCode) {
        nextValue += keyCode;
      }
      switch (selectKey(target, key)) {
        case 'transform':
          if (keyCode) {
            target.style.transform = key + '(' + nextValue + ')';
          } else {
            target.style.transform = key + '(' + nextValue + 'px)';
          }
          break;
        case 'style':
          target['style'][key] = nextValue;
          break;
        case 'attribute':
          target[key] = nextValue;
      }
    }

    // 改变target所有的属性
    function changeAll(elapsed, current, _final2) {
      anime.targets.forEach(function (target, index) {
        Object.keys(anime.dest).forEach(function (key) {
          var origin = parseFloat(cloneTargets[index][key]);
          var dest = anime.dest[key];
          // 对象类型
          if (typeof dest === 'object') {
            if (dest instanceof Array) {
              // keyframe模式
              // 支持 [{value: 1, duration: 500, easing: 'linear'},{value: 2, duration: 500, easing: 'linear'}]
              var i = 0;
              for (; i < dest.length; i++) {
                if (current - start < dest[i].startTimeStamp) {
                  break;
                }
              }
              var _dest = dest[i - 1],
                value = _dest.value,
                duration = _dest.duration,
                easing = _dest.easing,
                startTimeStamp = _dest.startTimeStamp;
              if (current <= start + duration + startTimeStamp) {
                elapsed = penner()[easing ? easing : anime.easing]()((current - start) / duration);
                change(target, origin, elapsed, value, key);
              } else if (_final2) {
                change(target, origin, elapsed, value, key, _final2);
              }
            } else {
              // nest模式
              // 支持 {value: 1, duration: 500, easing: 'linear'}
              var _dest2 = dest,
                _value = _dest2.value,
                _duration = _dest2.duration,
                _easing = _dest2.easing;
              if (current <= start + _duration) {
                elapsed = penner()[_easing ? _easing : anime.easing]()((current - start) / _duration);
                change(target, origin, elapsed, _value, key);
              } else if (_final2) {
                change(target, origin, elapsed, _value, key, _final2);
              }
            }
          } else {
            // function模式
            if (typeof dest === 'function') {
              dest = dest(target, index);
            }
            change(target, origin, elapsed, dest, key, _final2);
          }
        });
      });
    }

    // 核心函数，用于控制动画rAF
    function step() {
      var current = Date.now();
      // 已经结束，调用结束回调
      if (current > end) {
        // 数据回正
        changeAll(1, current, true);
        anime.complete && typeof anime.complete == 'function' && anime.complete(anime.targets);
        anime.isPlay = false;
        return;
      }
      // 还未开始，继续delay
      if (current < start) {
        requestAnimationFrame(step);
        return;
      }
      var elapsed = penner()[anime.easing]()((current - start) / anime.duration);
      // targets有效
      isValid && changeAll(elapsed, current);
      // 调用更新回调
      anime.update && typeof anime.update == 'function' && anime.update(anime.targets);
      requestAnimationFrame(step);
    }
    initTarget();
    // 调用初始回调
    anime.begin && typeof anime.begin == 'function' && anime.begin(anime.targets);
    step();
  };

  // 默认配置
  var defaultOptions = {
    targets: null,
    duration: Infinity,
    easing: 'linear',
    delay: 0,
    begin: null,  // 初始回调
    update: null, // 更新回调
    complete: null  // 结束回调
  };

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
          continue;
        target[key] = source[key];
      }
    } return target;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i; for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i]; if (excluded.indexOf(key) >= 0)
        continue; target[key] = source[key];
    } return target;
  }

  var Anime = function () {
    var _excluded = ["targets", "duration", "easing", "delay", "begin", "update", "complete"];
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOptions;
    options = Object.assign({}, defaultOptions, options);
    var _options = options,
      targets = _options.targets,
      duration = _options.duration,
      easing = _options.easing,
      delay = _options.delay,
      begin = _options.begin,
      update = _options.update,
      complete = _options.complete,
      dest = _objectWithoutProperties(_options, _excluded);
    this.targets = targets;
    this.duration = duration;
    this.easing = easing;
    this.delay = delay;
    this.begin = begin;
    this.update = update;
    this.complete = complete;
    this.dest = dest ? dest : {};
    this.tl = null;
    this.isPlay = false;
  };
  Anime.prototype.timeline = function () {
    if (this.tl === null) {
      this.tl = new Timeline();
    }
    return this.tl;
  };
  Anime.prototype.play = function () {
    if (!this.isPlay) {
      this.isPlay = true;
      engine(this);
    }
  };

  var Timeline = function () {
    this.queue = [];
  };
  Timeline.prototype.add = function (options) {
    this.queue.push(new Anime(options));
    return this;
  };
  Timeline.prototype.play = function () {
    this.queue.forEach(instance => instance.play());
  };

  global.anime = function (options) {
    return new Anime(options);
  };
  global.anime.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
})(window);