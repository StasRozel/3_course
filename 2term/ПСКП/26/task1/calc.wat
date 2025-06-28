(module
  (func $sum (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add)
  (func $sub (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.sub)
  (func $mul (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.mul)
  (func $div (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.div_s)
  (export "sum" (func $sum))
  (export "sub" (func $sub))
  (export "mul" (func $mul))
  (export "div" (func $div)))