import Vue from 'vue'
import RULES from './rules'
import { is, parsePath, assign } from './utils'

function check(rule, field, value, isArray) {
  if (Array.isArray(rule)) {
    let message = "";
    const ruleArr = rule.map(item =>{
      const checkObj = check.call(this, item, field, value, true);
      if((!checkObj.checked)&&(!message))message=checkObj.message;
     return checkObj['checked']
    }).indexOf(false) === -1
    return {checked: ruleArr , message}
  }
  const $rules = this.$vuerify.$rules
  const $errors = this.$vuerify.$errors
  const regex = is('String', rule)
    ? $rules[rule]
    : rule.required ? assign({}, $rules['required'], $rules[rule]) : (is('String', rule.test) ? $rules[rule.test] : rule)

  if (!regex || !regex.test) {
    console.warn('[vuerify] rule does not exist: ' + (rule.test || rule))
    return
  }
  let message = rule.message || regex.message;
  regex.message = rule.message || regex.message
  const valid = is('Function', regex.test)
    ? regex.test.call(this, value)
    : regex.test.test(value);
  // if (!isArray) {
    const oldError = $errors[field]

    if (valid) {
      Vue.delete($errors, field)
    } else if (!oldError) {
      Vue.set($errors, field, regex.message)
      message = regex.message;
    }
  // } else {
  //   const error = $errors[field] || ""
  //   const oldError = error.indexOf(regex.message)

  //   if (valid) {
  //     // oldError > -1 && error.splice(oldError, 1)
  //     if (!error.length) Vue.delete($errors, field)
  //   } else if (oldError < 0) {
  //     console.log(field,)
  //     // error.push(regex.message)
  //     Vue.set($errors, field, error[0])
  //     message = error[0];
  //   }
  // }

  const hasError = Boolean(Object.keys($errors).length)
  this.$vuerify.valid = !hasError
  this.$vuerify.invalid = hasError
  return {checked:valid,message:message}
}

function init() {
  const rules = this.$options.vuerify
  /* istanbul ignore next */
  if (!rules) return
  this.$vuerify = new Vuerify(this)
  // Object.keys(rules).forEach(field =>
  //   this.$watch(field, value => check.call(this, rules[field], field, value))
  // )
  Object.keys(rules).forEach(field => {
    this.$watch(field, value => {
      // return check.call(this, rules[field], field, value)
      const crules = rules[field];
      Object.keys(crules).forEach(cfield => {
        return check.call(this, crules[cfield], cfield, value[crules[cfield]])['checked']
      })
    })
  })
}

const Vuerify = function (_vm) {
  this.vm = _vm
  Vue.util.defineReactive(this, '$errors', {})
  Vue.util.defineReactive(this, 'invalid', true)
  Vue.util.defineReactive(this, 'valid', false)
}

Vuerify.prototype.check = function (fields) {
  const vm = this.vm
  const rules = vm.$options.vuerify
  const parse = Vue.util.parsePath || parsePath
  let message = "" ;
  fields = fields || Object.keys(rules)
  // return fields.map(field =>
  //   check.call(vm, rules[field], field, parse(field)(vm._data))
  // ).indexOf(false) === -1
  
  let data = fields.map(field => {
    let xfield = [], fkeys = "";
    if (is('String', field)) {
      fkeys = field;
      xfield = Object.keys(rules[fkeys]);
    } else {
      fkeys = Object.keys(field)[0];
      xfield = field[fkeys];
    }
    return xfield.map(cfield =>{
      var checkObj = check.call(vm, rules[fkeys][cfield], cfield, parse(cfield)(vm['_data'][fkeys]));
      if((!checkObj.checked)&&(!message))message=checkObj.message;
      return checkObj['checked'];
    }).indexOf(false) === -1
  }).indexOf(false) === -1;
  return new Promise(res => {
    return res({
      message: message,
      checked: data
    })
  }, rej => {

  })
}

Vuerify.prototype.clear = function () {
  this.$errors = {}
  return this
}

const vuerify = Vue.directive("vuerify", {
  bind: function (el, binding, vnode) {
    // const {data} = vnode;
    // const {model} = data;
    // const {expression} = model;
  },
  inserted: function (el, binding, vnode) {

  }
});
export default function (_Vue, opts) {
  Vuerify.prototype.$rules = assign({}, RULES, opts)
  Vue.mixin({ created: init })
}
