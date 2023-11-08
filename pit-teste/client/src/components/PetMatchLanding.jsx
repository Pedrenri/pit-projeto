import React from "react";
import { motion } from "framer-motion";
import image4 from "../assets/image 4.svg";
import image5 from "../assets/image 5.svg";
import whitelogo from "../assets/white_logo.png";

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
  hover: {
    scale: 1.05,
  },
};

const PetMatchLanding = () => {
  return (
    <div className="min-h-screen" id="principal">
      <div className="container mx-auto mt-8 xl:px-48 py-4 bg-white xl:shadow-xl">
        <div className="text-center mt-10">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold mb-4"
          >
            Bem-vindo ao PetMatch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-lg mb-8 text-gray-600"
          >
            Encontre o par perfeito para o seu melhor amigo peludo no PetMatch,
            o melhor aplicativo de encontros para animais de estimação.
          </motion.p>
        </div>

        <div className="mt-8  rounded-lg text-gray-600 mx-auto ">
          <div className="img-landing-holder flex flex-col items-center md:flex-row md:shadow-2xl py-8 rounded-xl ">
            <div className="w-11/12 flex flex-col items-center justify-center">
              <motion.h2
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-2xl font-semibold mb-4"
              >
                O que é o PetMatch?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-4 text-justify md:px-24 text-xl"
              >
                Somos a PetMatch, o lugar onde corações peludos encontram seus
                pares perfeitos! Somos uma plataforma de encontros para animais
                de estimação, inspirada em aplicativos de namoro, mas com um
                toque especial para nossos amigos de quatro patas e suas
                famílias amorosas. Estamos aqui para ajudar a tornar a jornada
                de encontrar um novo amigo peludo divertida, fácil e
                emocionante!
              </motion.p>
            </div>
            <div className="flex flex-col items-center justify-center gap-y-4">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="w-3/4"
              >
                <img
                  src={image4}
                  alt="Imagem 1"
                  className="w-full h-auto rounded-lg"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="w-3/4"
              >
                <img
                  src={image5}
                  alt="Imagem 2"
                  className="w-full h-auto rounded-lg"
                />
              </motion.div>
            </div>
          </div>

          <motion.h2
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-2xl font-semibold mb-4 mt-8"
          >
            Nossos Valores
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-20 md:p-0">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-gray-100 p-4 rounded-lg cursor-pointer shadow-sm"
                variants={cardVariants}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.1 }}
              >
                <h3 className="text-xl text-purple-800 font-semibold mb-2">
                  {value.title}
                </h3>
                {value.hover && <p className="text-gray-700">{value.hover}</p>}
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8">Comece Agora!</h2>
          <p className="text-justify px-12 md:p-0">
            Junte-se a milhares de amantes de animais de estimação que já
            encontraram o par perfeito para os seus amigos peludos. Crie sua
            conta no PetMatch hoje e comece a fazer conexões valiosas.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <footer className="text-center text-white flex flex-col md:flex-row justify-between py-12 md:px-12">
          <img
            src={whitelogo}
            className="mt-8"
            width="400px"
            alt="PetMatch Logo"
          />
          &copy; {new Date().getFullYear()} PetMatch. Todos os direitos
          reservados.
        </footer>
      </div>
    </div>
  );
};

const values = [
  {
    title: "Comunidade Amorosa",
    hover:
      "Acreditamos em construir uma comunidade amorosa onde todos os animais de estimação e suas famílias se sintam bem-vindos e apoiados.",
  },
  {
    title: "Conexões Reais",
    hover:
      "Estamos comprometidos em promover conexões reais entre animais de estimação e suas famílias, baseadas em interesses comuns e compatibilidade.",
  },
  {
    title: "Cuidado e Segurança",
    hover:
      "Garantimos que todos os perfis sejam revisados para garantir a segurança e o bem-estar de todos os membros da nossa comunidade.",
  },
];

export default PetMatchLanding;
