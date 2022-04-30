import { Form, Link } from "remix";
import Button from "./Button";
const LoginForm = ({ action }: { action?: string }) => {
  return (
    <Form className="form-login mt-10" method="post" action={action && action}>
      <div className="single-fild">
        <input
          className="px-6 h-10 mb-6 border-secondary-90 bg-secondary-100 hover:border-primary transition-all border-2 border-solid block rounded-md w-full focus:outline-none"
          type="text"
          placeholder="Alias"
          name="alias"
        />
      </div>
      <div className="single-fild">
        <input
          className="px-6 h-10 mb-6 border-secondary-90 bg-secondary-100 hover:border-primary transition-all border-2 border-solid block rounded-md w-full focus:outline-none"
          type="password"
          name="password"
          placeholder="password"
        />
      </div>
      <div className="button text-center">
        <Button
          type={"submit"}
          color={"primary"}
          shape={"square"}
          className="text-white"
        >
          Login
        </Button>
      </div>
      <div className="account-text mt-5 text-center">
        <p>
          Don‘t have account?
          <Link to="/register" className="text-yellow-400 font-semibold">
            Signup here
          </Link>
        </p>
      </div>
    </Form>
  );
};
export default LoginForm;
