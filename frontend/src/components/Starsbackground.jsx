import { useCallback} from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Starsbackground(){
    const particlesInit = useCallback(async(engine)=> {
        await loadFull(engine);
    },[]);
    return (
        <Particles
        id="tsparticles"
        init={particlesInit}

        options ={{
            fullScreen:{
                enable:true,
                zIndex:-1,
            },
            background:{
                color:{
                    value:"transparent",
                },
            },
            particles:{
                number:{
                    value:100,
                },
            color:{
                value:"#ffffff",
            },
            size:{
                value:{
                    min:1,
                    max:3,
                },
            },
            move:{
                enable:true,
                speed:0.3,
            },
            opacity:{
                value:0.7,
            },
        },
        }}
        />
    );
}