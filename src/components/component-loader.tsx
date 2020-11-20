const ComponentLoader: React.FC<{}> = () => {
    return (
        <div className="d-flex py-6 justify-content-center align-items-center">
            <div className="spinner-border text-white" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default ComponentLoader;
