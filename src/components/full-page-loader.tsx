const FullPageLoader: React.FC<{}> = () => {
    return (
        <div className="d-flex vh-100 bg-white justify-content-center align-items-center">
            <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default FullPageLoader;
