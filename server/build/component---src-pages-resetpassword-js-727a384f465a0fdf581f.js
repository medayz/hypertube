(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{FcgE:function(e,a,r){"use strict";r.r(a);r("+L6B");var t=r("2/Rp"),s=(r("y8nQ"),r("Vl3Y")),n=(r("5NDa"),r("5rEg")),o=r("q1tI"),l=r.n(o),m=(r("8L6m"),r("tBDR")),c=r("vDqi"),i=r.n(c),d={border:0,outline:"none"},u=s.a.create({name:"resetpassword"})((function(e){var a=e.form,r=(e.token,a.getFieldDecorator),o=a.getFieldsValue,m=a.setFields;return l.a.createElement(s.a,{onSubmit:function(e){e.preventDefault();var a=o();i.a.post("/api/v1/users/resetpassword",a).then((function(e){var a=e.data;console.log(a)})).catch((function(e){var r=e.response.data;console.log(r.error);var t={password:{value:a.password,errors:[new Error(r.message)]}};m(t)}))},className:"login-form"},l.a.createElement("h2",{id:"my-h2"},"Reset Password"),l.a.createElement("div",{className:"empty"}),l.a.createElement(s.a.Item,null,r("password",{rules:[{required:!0,message:"Please enter your Password!"}]})(l.a.createElement(n.a.Password,{type:"password",placeholder:"Password",style:d}))),l.a.createElement(s.a.Item,null,l.a.createElement(t.a,{type:"primary",htmlType:"submit",className:"login-form-button"},"Reset")))}));a.default=function(e){var a=e.token;return l.a.createElement("div",{className:"form-background"},l.a.createElement("div",{className:"form-group"},l.a.createElement(m.a,{className:"img",size:"Medium"}),l.a.createElement("div",{className:"form-controls"},l.a.createElement(u,{token:a}))))}}}]);
//# sourceMappingURL=component---src-pages-resetpassword-js-727a384f465a0fdf581f.js.map