import Link from "next/link";

const Header = ({ currentUser }) => {
    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/" className="navbar-brand">
                GitTix
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {currentUser ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" href="/tickets/new">
                                    Sell Tickets
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/orders">
                                    My Orders
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/auth/signout">
                                    Sign Out
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" href="/auth/signup">
                                    Sign Up
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/auth/signin">
                                    Sign In
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Header;
