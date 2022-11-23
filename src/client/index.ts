import { getRobots, login } from './service.js';
//import jwt_decode from '../../node_modules/jwt-decode/build/jwt-decode.esm.js';
import jwt_decode from 'jwt-decode';

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const handlerSubmit = async (ev: Event) => {
            ev.preventDefault();
            const aInputs = document.querySelectorAll('input');
            const values = [...aInputs].map((item) => item.value);
            const user = {
                name: values[0],
                passwd: values[1],
            };
            const token = await login(user);
            console.log(token);
            localStorage.setItem('robots', JSON.stringify(token));
            // Actualización al estada
        };

        const handleClick = async () => {
            console.log('Get Robots');
            const robots = await getRobots(token);
            console.log(robots);
        };

        const form = document.querySelector('form');
        const section = document.querySelector('section');
        form?.addEventListener('submit', handlerSubmit);

        const loginData = localStorage.getItem('robots');
        let token = '';
        const btrRobots = document.querySelector('#robots');
        btrRobots?.addEventListener('click', handleClick);

        // Actualización del estado
        if (loginData) {
            const decodeToken = jwt_decode(JSON.parse(loginData).token); // {user: "Pepe", role: ''}
            console.log(decodeToken);
            token = JSON.parse(loginData).token;
            (form as HTMLFormElement).hidden = true;
            (section as HTMLElement).hidden = false;
        }
    });
})();
