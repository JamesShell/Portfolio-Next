import { useMemo, useEffect, useLayoutEffect } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { AsciiEffect } from "three-stdlib";

extend({ AsciiEffect });

export default function AsciiRenderer({
  renderIndex = 1,
  characters = " @%#*+=-:. ",
  bgColor = "black",
  fgColor = "green",
  invert = true,
  color = false,
  resolution = 0.175,
}) {
  const { size, gl, scene, camera } = useThree();

  const effect = useMemo(() => {
    if (!gl || !size.width || !size.height) return;
    const effect = new AsciiEffect(gl, characters, {
      invert,
      color,
      resolution,
    });
    effect.domElement.style.position = "absolute";
    effect.domElement.style.zIndex = "-1";
    effect.domElement.style.top = "0px";
    effect.domElement.style.left = "0px";
    effect.domElement.style.pointerEvents = "none";
    return effect;
  }, [gl, characters, invert, color, resolution, size]);

  useLayoutEffect(() => {
    if (effect) {
      effect.domElement.style.color = fgColor;
      effect.domElement.style.backgroundColor = bgColor;
    }
  }, [effect, fgColor, bgColor]);

  useEffect(() => {
    if (!effect || !gl.domElement.parentNode) return;
    gl.domElement.style.opacity = "0";
    gl.domElement.parentNode.appendChild(effect.domElement);

    return () => {
      gl.domElement.style.opacity = "1";
      gl.domElement.parentNode?.removeChild(effect.domElement);
    };
  }, [effect, gl]);

  useEffect(() => {
    if (effect && size.width && size.height) {
      effect.setSize(size.width, size.height);
    }
  }, [effect, size]);

  useFrame(() => {
    if (effect) {
      effect.render(scene, camera);
    }
  }, renderIndex);

  return null;
}
