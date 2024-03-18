import React,{useState} from 'react'
import { useForm } from 'react-hook-form'
import Buttoncomp from '../../components/Button/Buttoncomp'
import './Signin.css'


function Signin() {
    const [error, setError] = useState('')
    const { register, handleSubmit } = useForm()

    const onSubmit = (data) => {
        console.log(data)
    }
  return (
    <div className='flex flex-col items-center text-white mt-12' id="register">
    <p className='text-3xl font-bold tracking-widest'>Login to your account</p>

    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-2/4 justify-center'>
        <div>
            <label htmlFor="email">Email: </label>
            <input type='email'
                id='email'
              
                placeholder='Enter your Email: '
                {...register("email", {
                    required: true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                            "Email address must be a valid address",
                    }
                })}
            />
        </div>
        <div>
            <label htmlFor="password">Password: </label>
            <input type="password"
              
                id='Password'
                placeholder='Enter your password'
                {...register("password", { required: true })}
            />
        </div>
        <div>
            <label htmlFor="confirmpassword">Confirm Password: </label>
            <input type="password"
            id='confirmpassword'
               
                placeholder='Confirm your password'
                {...register("confirmpassword", { required: true })}
            />
        </div>

        <Buttoncomp type="submit" addedclass='w-fit m-auto'>
            Login
        </Buttoncomp>


    </form>

    <div className='sign'>Don&apos;t have an account? <Buttoncomp>Register</Buttoncomp></div>
</div>
  )
}

export default Signin