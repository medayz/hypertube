(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{Wwxz:function(e,a,t){"use strict";t.r(a);var r=t("q1tI"),l=t.n(r),s=(t("Y1Il"),t("+L6B"),t("2/Rp")),n=(t("y8nQ"),t("Vl3Y")),m=(t("5NDa"),t("5rEg")),o=(t("91GP"),t("8L6m"),t("Wbzz")),i=t("vDqi"),c=t.n(i),u={border:0,outline:"none"},d=n.a.create({name:"register"})((function(e){var a=e.form,t=a.getFieldDecorator,r=a.getFieldsValue,i=a.resetFields,d=a.setFields;return l.a.createElement(n.a,{onSubmit:function(e){e.preventDefault();var a=r();c.a.post("/api/v1/users",a).then((function(e){var a=e.data;console.log(a),i()})).catch((function(e){var t=e.response.data,r=Object.assign({},a);for(var l in r)r[l]={value:r[l],errors:[new Error(t.details[l])||""]};d(r)}))},className:"login-form"},l.a.createElement("h2",{id:"my-h2"},"SIGN UP"),l.a.createElement("div",{className:"empty"}),l.a.createElement(n.a.Item,null,t("username",{rules:[{required:!0,message:"Please enter your username!"}]})(l.a.createElement(m.a,{placeholder:"Username",style:u}))),l.a.createElement(n.a.Item,null,t("firstName",{rules:[{required:!0,message:"Please enter your First Name!"}]})(l.a.createElement(m.a,{placeholder:"First Name",style:u}))),l.a.createElement(n.a.Item,null,t("lastName",{rules:[{required:!0,message:"Please enter your Last Name!"}]})(l.a.createElement(m.a,{placeholder:"Last Name",style:u}))),l.a.createElement(n.a.Item,null,t("email",{rules:[{required:!0,message:"Please enter your Email Address!"}]})(l.a.createElement(m.a,{placeholder:"Email Address",style:u}))),l.a.createElement(n.a.Item,null,t("password",{rules:[{required:!0,message:"Please enter your Password!"}]})(l.a.createElement(m.a.Password,{type:"password",placeholder:"Password",style:u}))),l.a.createElement(n.a.Item,null,l.a.createElement(o.Link,{className:"login-form-forgot",to:"/signin"},"Sign In ?"),l.a.createElement(s.a,{type:"primary",htmlType:"submit",className:"login-form-button"},"SIGN UP")))})),p=t("tBDR");a.default=function(){return l.a.createElement("div",{className:"form-background"},l.a.createElement("div",{className:"form-group",style:{position:"relative",margin:"42px auto",height:"auto"}},l.a.createElement(p.a,{className:"img",size:"Medium"}),l.a.createElement("div",{className:"form-controls",style:{marginTop:"42px"}},l.a.createElement(d,null))))}}}]);
//# sourceMappingURL=component---src-pages-signup-js-067a15fa782ee01a0129.js.map