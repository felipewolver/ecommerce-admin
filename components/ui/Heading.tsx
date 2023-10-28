
interface HeadingProps {
    title: string;
    description: string;
  }


// Component Heading personalizado. Ele tbm estah reutilizado em outros components
export const Heading: React.FC<HeadingProps> = ({
    title,
    description
  }) => {
    return ( 
        <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    );
  };