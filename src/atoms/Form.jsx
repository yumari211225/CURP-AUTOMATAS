import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ReCAPTCHA from "react-google-recaptcha";
import "../assets/style/Button.css";
import "../assets/style/Form.css";

function Form() {
    const [formData, setFormData] = useState([]);
    const [isVerified, setIsVerified] = useState(false);
    const [isCaptchaSolved, setIsCaptchaSolved] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [userInput, setUserInput] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [dia, setDia] = useState('');
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [sexo, setSexo] = useState('');
    const [estado, setEstado] = useState('');

    const handleCaptchaResponseChange = (response) => {
        if (response) {
            setIsVerified(true);
        }
    };
    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        let randomString = '';
        const characters = '6LcntpApAAAAAABa5Ndio61PfktpRp_ajCpddq2b';
        for (let i = 0; i < 5; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptcha(randomString);
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (userInput !== captcha) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El captcha ingresado no coincide!',
            });
            generateCaptcha();
            setUserInput('');
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Bien hecho!',
                text: 'El captcha ingresado coincide.',
            });
            setIsCaptchaSolved(true);
            setUserInput('');
        }
    };

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const generateCURP = () => {
        const vowels = 'AEIOU';
        const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
        let curp = removeAccents(apellidoPaterno[0] + (Array.from(apellidoPaterno.slice(1)).find(c => vowels.includes(c.toUpperCase())) || ''));
        curp += removeAccents(apellidoMaterno[0] + nombre[0]);
        curp += ano.slice(2) + (mes.length === 1 ? '0' + mes : mes) + (dia.length === 1 ? '0' + dia : dia);
        curp += sexo[0].toUpperCase();
        curp += estado ? estado.slice(0, 2).toUpperCase() : '';
        curp += removeAccents((Array.from(apellidoPaterno.slice(1)).find(c => consonants.includes(c.toUpperCase())) || ''));
        curp += removeAccents((Array.from(apellidoMaterno.slice(1)).find(c => consonants.includes(c.toUpperCase())) || ''));
        curp += removeAccents((Array.from(nombre.slice(1)).find(c => consonants.includes(c.toUpperCase())) || ''));
        return curp.toUpperCase();
    };

    const isLeapYear = (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };

    const handleSubmitAlertDataForm = (event) => {
        event.preventDefault();
    
        // Validar los datos del formulario
        if (!isValidData()) {
            Swal.fire('Error', 'Por favor, ingresa una fecha válida', 'error');
            return;
        }
    
        // Generar CURP
        const curp = generateCURP();
    
        // Agregar los datos del formulario al estado en lugar de mostrar una alerta
        setFormData([...formData, { curp, nombre, apellidoPaterno, apellidoMaterno, dia, mes, ano, sexo, estado }]);
        
        Swal.fire({
            title: 'Enviado!',
            text: 'Tu formulario ha sido enviado.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    };
    

    const handleDayChange = (e) => {
        const day = e.target.value;
        const selectedMonth = parseInt(mes);
        const selectedYear = parseInt(ano);

        if (day < 1 || day > 31) {
            Swal.fire('Error', 'El día debe estar entre 1 y 31', 'error');
            return;
        }

        if (selectedMonth === 2) {
            const isLeap = isLeapYear(selectedYear);
            if (isLeap && day > 29) {
                Swal.fire('Error', "Febrero no puede tener más de 29 días en un año bisiesto", 'error');
                return;
            } else if (!isLeap && day > 28) {
                Swal.fire('Error', "Febrero no puede tener más de 28 días en un año no bisiesto", 'error');
                return;
            }
        } else if ([4, 6, 9, 11].includes(selectedMonth) && day > 30) {
            Swal.fire('Error', "Este mes no puede tener más de 30 días", 'error');
            return;
        }
        setDia(day);
    };


    const handleMonthChange = (e) => {
        const month = e.target.value;
        if (month < 1 || month > 12) {
            Swal.fire('Error', 'El mes debe estar entre 1 y 12', 'error');
            return;
        }
        setMes(month < 10 ? `0${month}` : month.toString());
    };

    const handleYearChange = (e) => {
        const year = e.target.value;
        if (year < 1920 || year > 2024) {
            Swal.fire('Error', "El año debe estar entre 1920 y 2024", 'error');
            return;
        }
        setAno(year);
    };

    const isValidData = () => {
        // Verificar si todos los campos requeridos están llenos
        if (!nombre || !apellidoPaterno || !apellidoMaterno || !dia || !mes || !ano || !sexo || !estado) {
            return false;
        }
    
        // Verificar si la fecha es válida
        const selectedMonth = parseInt(mes);
        const selectedYear = parseInt(ano);
        if (selectedMonth === 2) {
            const isLeap = isLeapYear(selectedYear);
            if (isLeap && dia > 29) {
                return false;
            } else if (!isLeap && dia > 28) {
                return false;
            }
        } else if ([4, 6, 9, 11].includes(selectedMonth) && dia > 30) {
            return false;
        }
    
        return true;
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100 formulario">
                <div className='form'>
                    <form onSubmit={handleSubmit}>
                        <p className="title">Consulta Curp </p>
                    </form>
                    <form onSubmit={handleSubmitAlertDataForm}>
                        <ReCAPTCHA sitekey="6LdKP48pAAAAACDznGQr7Uj74R9dcJ85Qi8coIZ8" onChange={handleCaptchaResponseChange} />
                        <label>
                            <input required="" placeholder="Nombre(s)" type="text" className="input mt-2 mb-2" disabled={!isVerified} onChange={e => setNombre(e.target.value)} />
                        </label>
                        <div className="flex">
                            <label>
                                <input required="" placeholder="Apellido Paterno" type="text" className="input mt-2 mb-2" disabled={!isVerified} onChange={e => setApellidoPaterno(e.target.value)} />
                            </label>
                            <label>
                                <input required="" placeholder="Apellido Materno" type="text" className="input mt-2 mb-2" disabled={!isVerified} onChange={e => setApellidoMaterno(e.target.value)} />
                            </label>
                        </div>
                        <p className='text-center'>Fecha De Nacimiento</p>
                        <div className="flex">
                            <label>
                                <input required="" placeholder="Día" type="number" className="input mt-2 mb-2" disabled={!isVerified} onChange={handleDayChange} />
                            </label>
                            <label>
                                <input required="" placeholder="Mes" type="number" className="input mt-2 mb-2" disabled={!isVerified} onChange={handleMonthChange} />
                            </label>
                            <label>
                                <input required="" placeholder="Año" type="number" className="input mt-2 mb-2" disabled={!isVerified} onChange={handleYearChange} />
                            </label>
                        </div>
                        <label>
                            <select className="input" onChange={e => setSexo(e.target.value)}>
                                <option value="">Sexo</option>
                                <option value="hombre">Hombre</option>
                                <option value="mujer">Mujer</option>
                            </select>
                        </label>
                        <label>
                            <select className="input" onChange={e => setEstado(e.target.value)}>
                                <option value="">Seleccionar estado</option>
                                <option value="CS">Chiapas</option>

                            </select>
                        </label>
                        <div>
                            <div className="d-flex justify-content-center">
                                <button className="btn mt-5" disabled={!isVerified || !isValidData()} onClick={handleSubmitAlertDataForm}>
                                    <i className="animation"></i>Generar CURP<i className="animation"></i>
                                </button>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <table className="centered-table">
                <thead>
                    <tr>
                        <th>CURP</th>
                    </tr>
                </thead>
                <tbody>
                    {formData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.curp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Form;




