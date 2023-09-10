import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react"; // Importe o componente Lottie
import animationData from "../assets/loading.json"; // Substitua pelo seu arquivo de animação JSON

const LoadingAnimation = () => {
  return (
    <motion.div
      className="loading-animation w-screen h-screen flex justify-center items-center"
      initial={{ opacity: 0, y:500 }}
      animate={{ opacity: 1, y:0 }}
      exit={{ opacity: 0,y:500 }}
    >
      <div className="w-3/5 lg:w-1/5">
        {/* Renderize a animação Lottie do cachorrinho e da bolinha */}
        <Lottie
          animationData={animationData} // Importe o arquivo JSON da animação
          loop
          autoplay
        />
        <h1 className="text-gray-600 text-lg">Carregando...</h1>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;
