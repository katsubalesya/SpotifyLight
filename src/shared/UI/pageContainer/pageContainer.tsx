import type {ComponentPropsWithoutRef, FC, PropsWithChildren,} from "react";
import styles from "./pageContainer.module.css";

type PageContainerProps = PropsWithChildren<
  ComponentPropsWithoutRef<"section">
>;

type PageContentProps = PropsWithChildren<
  ComponentPropsWithoutRef<"div">
>;

type PageContainerComponent = FC<PageContainerProps> & {
  Content: FC<PageContentProps>;
};

const PageContent: FC<PageContentProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`${styles.content} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export const PageContainer: PageContainerComponent = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <section className={`${styles.page} ${className}`.trim()} {...props}>
      {children}
    </section>
  );
};
PageContainer.Content = PageContent;
