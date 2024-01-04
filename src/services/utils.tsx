import React from "react";
import { Suspense } from "react";

// React.Children
export function AddSuspense({ children }: { children: React.ReactNode }) {
  const loadingImg = require("./../static/images/loading.gif");
  console.log(
    "image",
    <img src={loadingImg} alt="" />,
    children?.toLocaleString()
  );
  return (
    <Suspense fallback={<img src={loadingImg} alt="" />}>
      {children ? children : <img src={loadingImg} alt="" />}
    </Suspense>
  );
}
export function appendUnit(s: string) {}
