import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Error capturado por ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            ⚠️ Ocurrió un error cargando SpainRoom
          </h1>
          <p className="text-gray-700 mb-4">
            {this.state.error?.toString()}
          </p>
          <p className="text-sm text-gray-500">
            Intenta recargar la página o volver al Inicio.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
